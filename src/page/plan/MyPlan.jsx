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

    //플랜 1개 조회
    const getPlan = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: cookies.Authorization
                }, withCredentials: true
            });

            const { findOnePlan, findPlace, category, findSchedule } = response.data;

            setPlan(findOnePlan);
            setPlace(findPlace);
            setCategory(category);
            setSchedule(findSchedule.schedule);

            console.log("플랜 조회 내용들 : ", findOnePlan);
            console.log("지역 조회 내용들 : ", findPlace);
            console.log("카테고리 조회 내용들 : ", category);
            console.log("스케줄 조회 내용들 : ", findSchedule);
        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                alert("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                alert("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                alert("오류가 발생했습니다: " + error.message);
                console.error("플랜 조회 에러:", error);
            }
        }
    }

    const getMember = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/member/plan/${id}`, {
                headers: {
                    Authorization: cookies.Authorization
                }, withCredentials: true
            });

            const members = response.data.members;

            setMember(members);

            console.log("멤버 조회 내용들 : ", members);
        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                alert("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                alert("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                alert("오류가 발생했습니다: " + error.message);
                console.error("멤버 조회 에러:", error);
            }
        }

    }

    useEffect(() => {
        getPlan();
        getMember();
    }, [id]);

    const planUpdate = async () => {

        //직접인지 추천인지 나눠서 주소 이동
        let url;
        if (plan.type === "Self") {
            url = `/plan/activeness/${plan.id}`;
        } else if (plan.type === "Auto") {
            url = `/plan/passivity/${plan.id}`;
        }
        window.location.href = url;

    }

    return (
        <div className="my-plan-container">
            <h2>플랜 세부 정보</h2>
    
            <button onClick={planUpdate} className="my-plan-edit-button">플랜 수정하기</button>
    
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
    
            <div className="my-plan-box">
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
            </div>
    
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

