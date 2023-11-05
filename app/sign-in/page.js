"use client"
import { Button, Form, Input, Col, Row, Spin, notification } from "antd"
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import { signIn } from "../apis";
import { apiCallWithAuth } from "../helpers/apiUtil";
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [emailLogin, setEmailLogin] = useState(true);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [mobileValid, setMobileValid] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [passwordValid, setPasswordValid] = useState(true);
  const router = useRouter()
  
  const changeLoginMethod = () => {
    setEmailLogin(!emailLogin)
    setPassword("");
    setMobile("");
    setEmail("");
    setEmailValid(true);
    setMobileValid(true);
  }

  const signInUser = async () => {

    if (emailLogin) {
      if (!email || !password) {
        api.warning({
          message: "Error",
          description: "Email/Password is required",
          duration: 1,
        });
        return;
      }

    } else if (!emailLogin) {
      if (!mobile || !password) {
        api.warning({
          message: "Error",
          description: "Mobile/Password is required",
          duration: 1,
        });
        return;
      }
    }
    setEmailValid(true);
    setMobileValid(true);
    setPasswordValid(true);
    setLoader(true);
    const response = await apiCallWithAuth(signIn, 'post', { email, password, mobile });

    const { Data, meta } = response;

    if (meta && meta.code && meta.code == 200) {
      api.success({
        message: "Success",
        description: `Welcome ${Data.first_name} ${Data.last_name}`,
        duration: 1,
      });
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
  }

  const checkValidMobile = () => {
    if (!mobile) return;

    return mobile.length == 10;
  }

  const passwordChange = () => {
    api.warning({
      message: "Hey!",
      description: "Please contact the admin. ",
      duration: 1,
    });
  }

  return (
    <>
      {contextHolder}
      {emailLogin ?
        <div className="div-border center  w-25">
          <div className="w-100" style={{ "padding": "50px" }}>
            <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input value={email} onBlur={() => checkValidEmail()} onChange={(e) => setEmail(e.target.value)} className="borders" placeholder="Enter your email" />
                </p>
                {email && !emailValid ? <span className="text-danger">Please enter a valid email address</span> : ""}
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
                <Button disabled = {loader || !emailValid} loading={loader} onClick={() => signInUser()} className="rad" type="primary">Login</Button>
              </Col>
              <Col className="d-flex justify-content-end" span={12}>
                {loader ? "" : <a onClick={changeLoginMethod} className="text-primary text-buttons">Login Using Mobile</a>}
              </Col>
            </Row>
          </div>

          {loader ? "" : <><Row>
            <Col className="d-flex justify-content-center" span={24}>
              <a onClick={passwordChange} className="text-primary text-buttons">Forgot Password?</a>
            </Col>
          </Row>
            <Row>
              <Col className="d-flex justify-content-center" span={24}>
                <p>Dont have an account? <Link href="/sign-up" className="text-primary text-buttons">Sign Up</Link> </p>
              </Col>
            </Row></>}
        </div> :
        <div className="div-border center  w-25">
          <div className="w-100" style={{ "padding": "50px" }}>
            <Row className="mb-3">
              <Col span={24}>
                <p>
                  <Input onBlur={() => checkValidMobile()} value={mobile} onChange={(e) => setMobile(e.target.value)} className="borders" placeholder="Enter your Mobile Number" />
                </p>
                {mobile && !mobileValid ? <span className="text-danger">Please enter a valid Mobile Number</span> : ""}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p>
                  <Input type={"password"} onChange={(e) => setPassword(e.target.value)} value={password} className="borders" placeholder="Enter your password" />
                  {!passwordValid ? <span className="text-danger">Please enter the Password</span> : ""}
                </p>
              </Col>
            </Row>
            <Row className="mt-3" >
              <Col span={12}>
                <Button disabled = {loader} loading={loader} onClick={() => signInUser()} className="rad" type="primary">Login</Button>
              </Col>
              <Col className="d-flex justify-content-end" span={12}>
                {loader ? "" : <a onClick={changeLoginMethod} className="text-primary text-buttons">Login Using Email</a>}
              </Col>
            </Row>
          </div>
          {loader ? "" : <> <Row>
            <Col className="d-flex justify-content-center" span={24}>
              <a onClick={passwordChange} className="text-primary text-buttons">Forgot Password?</a>
            </Col>
          </Row>
            <Row>
              <Col className="d-flex justify-content-center" span={24}>
                <p>Dont have an account? <Link href="/sign-up" className="text-primary text-buttons">Sign Up</Link> </p>
              </Col>
            </Row></>}
        </div>}

    </>
  )
}
