import React from 'react';
import {Card, Col, Image} from "react-bootstrap";
import star from "../assets/star.png"
import {useNavigate} from "react-router-dom"
import {DEVICE_ROUTE} from "../utils/consts";

const DeviceItem = ({device}) => {
    const history = useNavigate()
    console.log(history)
    return (
        <Col className="p-0" md={3} onClick={() => history(DEVICE_ROUTE + "/" + device.id)}>
            <Card className="mt-3" style={{width: 150, cursor: "pointer"}} border={"light"}>
                    <Image width={200} height={200} src={device.img} />
                <div className="text-black-50 d-flex justify-content-between align-items-center">
                    <div>Samsung</div>
                    <div className="mt-1 d-flex align-items-center">
                        <div>{device.rating}</div>
                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
                <div>{device.name}</div>
            </Card>
        </Col>
    );
};

export default DeviceItem;