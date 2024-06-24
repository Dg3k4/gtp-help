const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {User, Basket, BasketDevice, Device, Rating} = require("../models/models")

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: "24h"}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest("Неверный логин или пароль"))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким email уже существует"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal("Пользователь с таким email не найден"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal("Указан неверный пароль"))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async createBasket(req, res, next) {
        const {deviceId} = req.params
        const userId = req.user.id
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return next(ApiError.badRequest("Нет такого пользователя"));
        }
        const basket = await Basket.findOne({ where: { userId: user.id } });
        if (!basket) {
            return next(ApiError.badRequest("У пользователя нет корзины"));
        }
        const device = await Device.findOne({ where: { id: deviceId } });
        if (!device) {
            return next(ApiError.badRequest("Нет такого устройства"));
        }
        const deviceBasket = await BasketDevice.create({basketId: basket.id, deviceId: deviceId})
        return res.json(deviceBasket);
    }
    async openBasket(req, res, next) {
        const userId = req.user.id
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest("У пользователя нет корзины"));
            }
            const basketDevice = await BasketDevice.findAll({where: {basketId: basket.id}})
            const deviceIds = basketDevice.map(i => i.deviceId)
            const devices = await Device.findAll({where: {id: deviceIds}}) // Эт инфа о устройствах
            const result = basketDevice.map(i => {
                const deviceInfo = devices.find(device => device.id === i.deviceId)
                return {
                    ...i.dataValues,
                    device: deviceInfo
                }
            })
            return res.json(result)
        } catch (e) {
            next(ApiError.badRequest("Чёт неправильно"))
        }
    }
    async clearBasket(req, res, next) {
        const userId = req.user.id
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest("У пользователя нет корзины"));
            }

            await BasketDevice.destroy({ where: { basketId: basket.id } });
            return res.json({ message: "Корзина очищена" });
        } catch (e) {
            next(ApiError.badRequest("Ты накосячил"));
        }
    }
    async deleteOneBasketItem(req, res, next) {
        const {deviceId} = req.params
        const userId = req.user.id
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest("У пользователя нет корзины"));
            }
            const device = await BasketDevice.findOne({where: {basketId: basket.id, deviceId}})
            if (!device) {
                return next(ApiError.badRequest("Предмета нет в корзине"))
            }
            await BasketDevice.destroy({where: {basketId: basket.id, deviceId}, limit: 1})
            return res.json(`${device.id} был удалён из корзины`)
        } catch (e) {
            next(ApiError.badRequest("Ты накосячил"));
        }
    }
    async setRating(req, res, next) {
        const {deviceId} = req.params
        const userId = req.user.id
        const {rate} = req.body
        try {
            const [user, device] = await Promise.all([
                User.findOne({ where: { id: userId } }),
                Device.findOne({ where: { id: deviceId } })
            ]);

            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }
            if (!device) {
                return next(ApiError.badRequest("Njdfh yt yfqlty"))
            }
            const rating = await Rating.findOne({where: {userId: user.id, deviceId: device.id}})
            if (rating) {
                return next(ApiError.badRequest("Оценка уже была поставлена"))
            }
            await Rating.create({userId: user.id, deviceId: device.id, rate})

            const ratings = await Rating.findAll({ where: { deviceId: device.id } });
            const averageRating = ratings.reduce((sum, rating) => sum + rating.rate, 0) / ratings.length;

            device.rating = averageRating;
            await device.save()

            return res.json({averageRating})
        } catch (e) {
            next(ApiError.badRequest("Ошибка при установке рейтинга"))
        }
    }
    async deleteRating(req, res, next) {
        const {deviceId} = req.params
        const userId = req.user.id

        const [user, device] = await Promise.all([
            User.findOne({ where: { id: userId } }),
            Device.findOne({ where: { id: deviceId } })
        ]);
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден"));
        }
        if (!device) {
            return next(ApiError.badRequest("Товар не найден"))
        }

        await Rating.destroy({where: {userId: user.id, deviceId: device.id}})
        const ratings = await Rating.findAll({ where: { deviceId: device.id } });
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rate, 0) / ratings.length;

        device.rating = averageRating;
        await device.save()
        return res.json("Оценка удалена")
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    async getAll(req, res, next) {
        const users = await User.findAll()
        return res.json(users)
    }
    async rt(req, res, next) {
        const ra = await Rating.findAll()
        return res.json(ra)
    }
}

module.exports = new UserController()