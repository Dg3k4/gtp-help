import React, {useContext} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import {NavLink} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts"
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink style={{color: "white", textDecoration: "none"}} to={SHOP_ROUTE}>КупиПродай</NavLink>
                {user.isAuth ?
                    <Nav className="ml-auto" style={{color: "white", display: "flex", gap: 10}}>
                        <Button variant={"outline-light"} onClick={() => logOut()}>Выйти</Button>
                        <Button variant={"outline-light"}>Корзина</Button>
                        <Button variant={"outline-light"} onClick={() => history(ADMIN_ROUTE)}>Админка</Button>
                    </Nav>
                    :
                    <Nav className="ml-auto" style={{color: "white", display: "flex", gap: 10}}>
                        <Button variant={"outline-light"} onClick={() => history(LOGIN_ROUTE)}>Войти</Button>
                    </Nav>
                }
            </Container>
        </Navbar>
    );
});

export default NavBar;