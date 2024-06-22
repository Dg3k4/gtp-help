import React from 'react';
import Container from "react-bootstrap/Container";
import {Button, Card, Col, Image, Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import phone from "../assets/phone.jpg";
import bigStar from "../assets/big_star.png";

const DevicePage = () => {
    const device = {id: 1, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone}
    const description = [
        {id: 1, title: "Оперативная память", description: "8 гб"},
        {id: 2, title: "Камера", description: "16 мп"},
        {id: 3, title: "Процессор", description: "Пентиум 3"},
        {id: 4, title: "Кол-во ядер", description: "2"},
        {id: 5, title: "Аккумулятор", description: "4500 мАч"},
    ]

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image width={300} height={300} src={device.img}></Image>
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2 style={{textAlign: "center"}}>{device.name}</h2>
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{background: `url(${bigStar}) no-repeat center center`, width: 260, height: 250, backgroundSize: "cover", fontSize: 70}}
                        >
                            {device.rating}
                        </div>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column gap-3 align-items-center justify-content-around"
                        style={{width: 300, height: 300, border: "2px solid lightgray"}}
                    >
                        <h3>От: {device.price} руб.</h3>
                        <Button variant={"outline-dark"}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {description.map((info, index) =>
                    <Row key={info.id} style={{background: index % 2 === 0 ? "lightgray" : "transparent", padding: 10}}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
};

export default DevicePage;