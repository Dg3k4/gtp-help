import React, {useContext, useState} from 'react';
import Container from "react-bootstrap/Container";
import {Button, Card, Form} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom"
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email,password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(user)
            user.setIsAuth(true)
            history(SHOP_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: window.innerHeight - 54}}>
            <Card style={{width: 700}} className="p-5">
                <h2 className="m-auto"> {isLogin ? "Авторизация" : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control placeholder="Введите почту" className="mt-3" value={email} onChange={e => setEmail(e.target.value)}/>
                    <Form.Control placeholder="Введите пароль" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} type="password"/>
                    <div className="mt-3 d-flex justify-content-between align-items-center pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Что, без акка? <NavLink to={REGISTRATION_ROUTE}>Жми сюда</NavLink>
                            </div>
                            :
                            <div>
                                Уже с аккаунтом? <NavLink to={LOGIN_ROUTE}>Тогда прошу сюда</NavLink>
                            </div>
                        }
                        <Button variant={"outline-success"} onClick={() => click()}>
                            {isLogin ? "Войти" : "Регистроваться"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;