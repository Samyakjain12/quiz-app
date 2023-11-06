"use client"

import { Button, Form, Input, Col, Row, notification } from "antd"
import { useState , useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import { addUser } from "../apis";
import { apiCallWithAuth } from "../helpers/apiUtil";
import Link from 'next/link'
import { UserAddOutlined , MobileOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'

export default function SignUp() {

  const [emailLogin, setEmailLogin] = useState(true);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [mobileValid, setMobileValid] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [passwordValid, setPasswordValid] = useState(true);
  const [fName , setFname] = useState("");
  const [lName , setLname] = useState("");
  const router = useRouter()
 
  useEffect (() => {
    const token = localStorage.getItem('athenticated');

    if(token) localStorage.removeItem('authenticated');
  })
  const addNewUser = async () => {
    debugger
    if(!email || !mobile || !fName || !lName || !password){
      api.warning({
        message: "Hey!",
        description: "Please Fill in all the details.",
        duration: 1,
      });
      return;
    }else if(!checkValidMobile()){
      api.warning({
        message: "Hey!",
        description: "Please check the mobile/email entered. ",
        duration: 1,
      });
      return;
    }else if(!checkValidEmail()){
      api.warning({
        message: "Hey!",
        description: "Please check the mobile/email entered. ",
        duration: 1,
      });
      return;
    }
    setEmailValid(true);
    setMobileValid(true);
    setPasswordValid(true);
    setLoader(true);
    const response = await apiCallWithAuth(addUser, 'post', { email, password, mobile , first_name:fName , last_name:lName });

    const { Data, meta } = response;

    if (meta && meta.code && meta.code == 200) {
      api.success({
        message: "Success",
        description: `Welcome ${Data.first_name} ${Data.last_name}`,
        duration: 1,
      });
      localStorage.setItem('athenticated' , true);
      router.push(`/quiz-page?user_id=${Data.user_id}`)
    } else if (meta && meta.code && meta.code === 400) {
      api.warning({
        message: "Sorry!",
        description: meta.Message,
        duration: 1,
      });
    } else {
      api.warning({
        message: "Error",
        description: "Could not login. Please try again later",
        duration: 1,
      });
    }
    setLoader(false);
  }

  const checkValidEmail = () => {
    debugger;
    if (!email) return true;
    const valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(email.toLowerCase());
    setEmailValid(valid);
    return valid;
  }

  const checkValidMobile = () => {
    if (!mobile) return;

    setMobileValid(mobile.length == 10);
    return mobile.length == 10;
  }


    return (
      <>
      {contextHolder}
        <div className="div-border center  w-25">
          <div className="w-100" style={{ "padding": "50px" }}>
          <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input value={fName} onChange={(e) => setFname(e.target.value)} className="borders" placeholder="Enter your first name" prefix = {<UserAddOutlined/>} />
                </p>
                {/* {email && !emailValid ? <span className="text-danger">Please enter a valid email address</span> : ""} */}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input value={lName}  onChange={(e) => setLname(e.target.value)} className="borders" placeholder="Enter your last name" prefix = {<UserAddOutlined/>} />
                </p>
                {/* {email && !emailValid ? <span className="text-danger">Please enter a valid email address</span> : ""} */}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input value={email} onBlur={() => checkValidEmail()} onChange={(e) => setEmail(e.target.value)} className="borders" placeholder="Enter your email" />
                </p>
                {email && !emailValid ? <span className="text-danger">Please enter a valid email address</span> : ""}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input value={mobile} onBlur={() => checkValidMobile()} onChange={(e) => setMobile(e.target.value)} className="borders" placeholder="Enter your mobile" prefix = {<MobileOutlined/>}/>
                </p>
                {mobile && !mobileValid ? <span className="text-danger">Please enter a valid mobile number</span> : ""}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p>
                  <Input type={"password"} onChange={(e) => setPassword(e.target.value)} value={password} className="borders" placeholder="Enter your password" />
                </p>
                {!passwordValid ? <span className="text-danger">Please enter the Password</span> : ""}
              </Col>
            </Row>
            <Row className="mt-3" >
              <Col span={12}>
              <Button disabled = {loader} loading={loader} onClick={() => addNewUser()} className="rad" type="primary">Sign Up</Button>
              </Col>
              <Col className="d-flex justify-content-end" span={12}>
                {loader ? "" : <p><Link href="/sign-in" className="text-primary text-buttons">Already have an account?</Link> </p>}
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }
  