const ApiError = require("../error/ApiError");

module.exports = async (req, res, next) => {
    const {userId} = req.params
    if (req.user.id !== parseInt(userId)) {
        return next(ApiError.badRequest("Это не ваша корзина"))
    }
    next()
}