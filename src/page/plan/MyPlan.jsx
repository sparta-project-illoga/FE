//내 플랜 1개 조회, 수정,

import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { useCookies } from 'react-cookie';

import "../../component/plan/MyPlan.css"

function MyPlan() {
    const [cookies] = useCookies(['Authorization']);
    const { id } = useParams();

    //내 플랜 1개 저장
    const [plan, setPlan] = useState([]);
    const [place, setPlace] = useState([]);
    const [category, setCategory] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [member, setMember] = useState([]);

    const [planId, setPlanId] = useState([]);

    //현재 조회한 플랜이 유저가 작성한 플랜들에 해당되는지 찾기
    const myPlans = async () => {
        try {
            const token = cookies.Authorization.replace('Bearer ', '');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat/planNchat`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
            });

            const plans = response.data.myPlanChats;
            const pId = plans.map(item => item.PlanRoom.plan.id);

            setPlanId(pId);
        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                console.log("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                console.log("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                console.error("플랜 조회 에러:", error);
            }
        }
    }

    //플랜 1개 조회
    const getPlan = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/${id}`);

            const { findOnePlan, findPlace, category, findSchedule } = response.data;

            setPlan(findOnePlan);
            setPlace(findPlace);
            setCategory(category);
            setSchedule(findSchedule.schedule);

        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                console.log("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                console.log("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                console.error("플랜 조회 에러:", error);
            }
        }
    }

    const getMember = async () => {
        try {
            const token = cookies.Authorization.replace('Bearer ', '');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
            });

            const members = response.data.members;

            setMember(members);
        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                console.log("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                console.log("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                console.error("멤버 조회 에러:", error);
            }
        }

    }

    useEffect(() => {
        getPlan();
        getMember();
        myPlans();
    }, [id]);

    const planUpdate = async () => {

        //직접인지 추천인지 나눠서 주소 이동
        let url;
        if (plan.type === "Self") {
            url = `/plan/activeness/${plan.id}`;
        } else if (plan.type === "Auto") {
            url = `/plan/passivity/${plan.id}`;
        } else {
            url = `/plan/activeness/${plan.id}`;
        }
        window.location.href = url;

    }

    return (
        <div className="my-plan-container">
            <h2>플랜 세부 정보</h2>

            {planId.includes(parseInt(id)) && (
                <button onClick={planUpdate} className="my-plan-edit-button">플랜 수정하기</button>
            )}

            <div className="my-plan-box">
                <div className="my-plan-detail">
                    <strong>플랜 이름:</strong> {plan.name}
                </div>
                <div className="my-plan-detail">
                    <strong>유저 ID:</strong> {plan.userId}
                </div>
                <div className="my-plan-detail">
                    <strong>플랜 유형:</strong> {plan.type}
                </div>
                <div className="my-plan-detail">
                    <strong>총 일자:</strong> {plan.totaldate}일
                </div>
                <div className="my-plan-detail">
                    <strong>총 예산:</strong> {plan.totalmoney}원
                </div>
                <div className="my-plan-detail">
                    <strong>이미지:</strong> {plan.image && (
                        <img src={`${process.env.REACT_APP_baseURL}${plan.image}`} alt={plan.name} className="my-plan-image" />
                    )}
                </div>
            </div>
            {planId.includes(parseInt(id, 10)) && (
                <div className="my-plan-box">
                    <>
                        <h3 className="my-plan-member">플랜 멤버</h3>
                        <ul className="my-plan-list">
                            {member.map((m) => (
                                <li key={m.memberId} className="my-plan-list-item">
                                    <strong className="my-plan-nickname">닉네임:</strong> {m.nickname} <br />
                                    <hr />
                                    <strong>타입:</strong> {m.type} <br />
                                </li>
                            ))}
                        </ul>
                    </>
                </div>
            )}


            <div className="my-plan-box">
                <h3 className="my-plan-subtitle">플랜 장소</h3>
                <ul className="my-plan-list">
                    {place.map((p) => (
                        <li key={p.id} className="my-plan-list-item">{p.placename}</li>
                    ))}
                </ul>
            </div>

            <div className="my-plan-box">
                <h3 className="my-plan-subtitle">카테고리</h3>
                <ul className="my-plan-list">
                    {category.map((c) => (
                        <li key={c.categoryId} className="my-plan-list-item">{c.category_name}</li>
                    ))}
                </ul>
            </div>

            <div className="my-plan-box">
                <h3 className="my-plan-subtitle">스케줄</h3>
                <ul className="my-plan-list">
                    {schedule.map((s) => (
                        <li key={s.id} className="my-plan-list-item">
                            <strong>장소:</strong> {s.place} <br />
                            <strong>일자:</strong> {s.date} <br />
                            <strong>비용:</strong> {s.money}원
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MyPlan;

