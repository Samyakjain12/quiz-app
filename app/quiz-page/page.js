"use client"

import { useState, useEffect } from "react";
// import { Row, Col } from "antd";
import { getAllQuestions, getUserAnswers,recordedAnswers,authenticateUser } from "../apis";
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link'
import NavBar from "../common-components/navigationBar";
import { useSearchParams } from 'next/navigation'
import { apiCallWithAuth } from "../helpers/apiUtil";
import { Col, Row, Radio, Space, Button , Avatar } from "antd";
import { useRouter } from 'next/navigation'

export default function Quiz() {


    const [question, setQuestions] = useState([]);
    const [answered, setAnswered] = useState();
    const [userResponse, setUserResponse] = useState([]);
    const [loader, setLoader] = useState(false)
    const [attempted , setAttempted] = useState(0);
    const [score , setScore] = useState(0);
    const [name , setName] = useState("");
    const router = useRouter()

    const searchParams = useSearchParams()

    useEffect(() => {
        const token = localStorage.getItem('athenticated');

        if(!token){
            router.push(`/sign-in`);
            return;
        }
        
        const id = searchParams.get('user_id');
        if(!id) {
            router.push(`/sign-in`);
            return;
        }
        


        const authenticate = async () => {
            const response = await apiCallWithAuth(authenticateUser+`/${id}`, 'get');
            const { Data, meta } = response;
    
            if (meta && meta.code != 200) {
                router.push(`/sign-in`);
                return;
            }else if(meta && meta.code == 200){
                const {first_name ,last_name} = Data;
                setName(first_name + " " + last_name);
            }
        }

        authenticate();
        
        const getQuestions = async () => {
            const response = await apiCallWithAuth(getAllQuestions, 'get');
            const { Data, meta } = response;
    
            if (meta && meta.code == 200) {
                setQuestions([...Data]);
            }
        };
        getQuestions();
        const getUserAnsweredQuestions = async () => {
            const id = searchParams.get('user_id')
            if (!id) return;
    
            const response = await apiCallWithAuth(getUserAnswers + `/${id}`, 'get');
            const { Data, meta } = response;
    
            if (meta && meta.code == 200) {
                setAnswered([...Data]);
                setAttempted(Data[0].attempted);
                setScore(Data[0].score);
            }
        }

        getUserAnsweredQuestions();

    }, []);

    const getUserAnsweredQuestions = async () => {
        const id = searchParams.get('user_id')
        if (!id) return;

        const response = await apiCallWithAuth(getUserAnswers + `/${id}`, 'get');
        const { Data, meta } = response;

        if (meta && meta.code == 200) {
            setAnswered([...Data]);
            setAttempted(Data[0].attempted);
            setScore(Data[0].score);
        }
    }


    const onRadioValueChange = (e) => {
        const index = e.target.name;
        const user_id = searchParams.get('user_id');

        let oldResponses = userResponse;

        let payload = {
            user_id,
            question_id: index,
            user_answer: e.target.value,
            is_deleted: 0
        }

        if (oldResponses && oldResponses[index - 1]) oldResponses[index - 1] = payload
        else oldResponses.push(payload);

        setUserResponse([...oldResponses]);

    }


    const submitAnswers = async () => {
        setLoader(true)
        const response = await apiCallWithAuth(recordedAnswers, 'post',userResponse);
        const { Data, meta } = response;

        if (meta && meta.code == 200) {
           await getUserAnsweredQuestions();
        }
        setLoader(false)
    }


    return (
        <>
            <NavBar score = {score} name = {name} />
            {question && question.length && question.map((obj, index) => {
                return (
                    <>
                        <Row className="mt-4">
                            <Col span={23} offset={1}>
                                <p>{index + 1}. {obj.question}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5} offset={1}>
                                <Radio.Group disabled = {attempted} name={obj.id} onChange={onRadioValueChange} key={index+1} value = {answered && answered.length && answered[index] && answered[index].user_answer ? answered[index].user_answer : userResponse && userResponse.length && userResponse[index] && userResponse[index].user_answer ? userResponse[index].user_answer : ""}>
                                    <Space direction="vertical">
                                        <Radio style={answered && answered.length && answered[index] && answered[index].user_answer && answered[index].user_answer == obj.option_a ? answered[index].user_answer == answered[index].answer ? { backgroundColor: '#4FFFB0', color: 'white' } : { backgroundColor: '#FF5C5C', color: 'white' } : {}} value={obj.option_a}>{obj.option_a}</Radio>
                                        <Radio style={answered && answered.length && answered[index] && answered[index].user_answer  && answered[index].user_answer == obj.option_b ? answered[index].user_answer == answered[index].answer ? { backgroundColor: '#4FFFB0', color: 'white' } : { backgroundColor: '#FF5C5C', color: 'white' } : {}} value={obj.option_b}>{obj.option_b}</Radio>
                                        <Radio style={answered && answered.length && answered[index] && answered[index].user_answer  && answered[index].user_answer == obj.option_c ? answered[index].user_answer == answered[index].answer ? { backgroundColor: '#4FFFB0', color: 'white' } : { backgroundColor: '#FF5C5C', color: 'white' } : {}} value={obj.option_c}>{obj.option_c}</Radio>
                                        <Radio style={answered && answered.length && answered[index] && answered[index].user_answer  && answered[index].user_answer == obj.option_d ? answered[index].user_answer == answered[index].answer ? { backgroundColor: '#4FFFB0', color: 'white' } : { backgroundColor: '#FF5C5C', color: 'white' } : {}} value={obj.option_d}>{obj.option_d}</Radio>
                                    </Space>
                                </Radio.Group>
                            </Col>
                            <Col span={11} offset={1}>
                                {answered && answered.length && answered[index] && answered[index].user_answer && answered[index].user_answer != answered[index].answer ? <Avatar style={{ backgroundColor: '#FF5C5C', color: 'white' }}>{answered[index].answer}</Avatar> : "" }                                
                            </Col>
                        </Row>
                    </>
                )
            })}
            <Row className="mt-4">
                <Col span={24} className='d-flex justify-content-center'>
                    <Button onClick = {() => submitAnswers()} disabled = {loader || !(userResponse.length === question.length) || attempted} className="w-25" type='primary'>
                        Submit
                    </Button></Col>
            </Row>
        </>
    )
}