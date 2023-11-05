"use client"

import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import 'bootstrap/dist/css/bootstrap.css';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link'

export default function NavBar(props) {
    

    const {name , score} = props;




    const signOutUser = () => {
        console.log("Signed Out");
    }

    const items = [
        {
            key: '1',
            label: (<p>{name}</p>
            ),
        },
        {
            key: '2',
            label: (
                <Link onClick={() => signoutUser()} >
                    Sign Out
                </Link>
            ),
        }
    ];
    return (
        <>
            <div className="navigation-bar mb-4">
                <Row className="p-4 d-flex justify-content-between">
                    <Col className="heading" span={10}><b>Quizzzz</b></Col>
                    <Col className="heading" span={6}><b>Score:{score}</b></Col>
                    <Col className="signout mr-4 heading" span={8}><HomeOutlined /></Col>
                </Row>
            </div>
        </>
    )
}