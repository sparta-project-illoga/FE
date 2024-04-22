//내 플랜 1개 조회, 수정,

import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { Cookies } from 'react-cookie';

function MyPlan() {
    const cookies = new Cookies();
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
            const token = cookies.get('access_token');

            const response = await axios.get(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
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
            const token = cookies.get('access_token');

            const response = await axios.get(`http://localhost:3000/member/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
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

    return (
        <div >
            <h2>플랜 세부 정보</h2>
            <div>
                <strong>플랜 이름:</strong> {plan.name}
            </div>
            <div>
                <strong>유저 ID:</strong> {plan.userId}
            </div>
            <div>
                <strong>플랜 유형:</strong> {plan.type}
            </div>
            <div>
                <strong>총 일자:</strong> {plan.totaldate}일
            </div>
            <div>
                <strong>총 예산:</strong> {plan.totalmoney}원
            </div>
            <div>
                <strong>이미지:</strong> <img src={`${process.env.REACT_APP_baseURL}${plan.image}`} alt={plan.name} />
            </div>

            <h3>플랜 멤버</h3>
            <ul>
                {member.map((m) => (
                    <li key={m.memberId}>
                        <strong>닉네임:</strong> {m.nickname} <br />
                        <strong>타입:</strong> {m.type} <br />
                    </li>
                ))}
            </ul>

            <h3>플랜 장소</h3>
            <ul>
                {place.map((p) => (
                    <li key={p.id}>{p.placename}</li>
                ))}
            </ul>

            <h3>카테고리</h3>
            <ul>
                {category.map((c) => (
                    <li key={c.categoryId}>{c.category_name}</li>
                ))}
            </ul>

            <h3>스케줄</h3>
            <ul>
                {schedule.map((s) => (
                    <li key={s.id}>
                        <strong>장소:</strong> {s.place} <br />
                        <strong>일자:</strong> {s.date} <br />
                        <strong>비용:</strong> {s.money}원
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MyPlan;

