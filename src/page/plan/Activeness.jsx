import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { Cookies } from 'react-cookie';

import Category from "../category/Category";
import "../../component/plan/Activeness.css"
import Member from "../member/Member";

function Activeness() {
    const cookies = new Cookies();
    const { id } = useParams();

    // 상태 변수 선언 및 초기화
    const [plan, setPlan] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        getPlan();
        fetchCategories();
    }, []);

    // 플랜 조회 함수
    const getPlan = async () => {
        try {
            const token = cookies.get('access_token');

            const response = await axios.get(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const plan = response.data.findOnePlan;
            const schedule = response.data.findSchedule.schedule;

            setPlan(plan);
            setSchedule(schedule);

            console.log("플랜 조회 내용들 : ", plan);
            console.log("스케줄 목록 : ", schedule);
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

    //처음 페이지 넘어갈 때 한 번 플랜에 저장된 내용들(플랜 내용,카테고리,스케줄) 조회해서 가져옴
    useEffect(() => {
        getPlan();
        // fetchCategories();
    }, []);

    //변경한 이름 저장
    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    //등록 버튼 누르면 빈 플랜에 변경한 이름, 파일 수정해서 저장
    const handleActiveness = async () => {
        try {
            const token = cookies.get('access_token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);

            console.log("formData : ", formData);

            const response = await axios.patch(`http://localhost:3000/plan/${id}/activeness`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            alert("플랜이 등록되었습니다.");
            getPlan();
        } catch (error) {
            handleError(error, "직접 등록 에러");
        }
    };

    const handleDelete = async () => {
        try {
            const token = cookies.get('access_token');
            await axios.delete(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
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
                console.error("플랜 삭제 에러:", error);
            }
        }
    }

    const deleteSchedule = async (scheduleId) => {
        try {
            const token = cookies.get('access_token');

            await axios.delete(`http://localhost:3000/${id}/schedule/${scheduleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            alert("스케줄이 삭제되었습니다.");

            const updatedSchedule = schedule.filter(item => item.id !== scheduleId);
            setSchedule(updatedSchedule);
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
                console.error("스케줄 삭제 에러:", error);
            }
        }
    }

    return (
        <div className="container">
            <div className="plan">
                <h1>{plan.name}</h1>
                <img
                    src={`${process.env.REACT_APP_baseURL}${plan.image}`}
                    alt={plan.name}
                    className="plan-image"
                />
                <p>총 날짜 : {plan.totaldate}</p>
                <p>총 금액 : {plan.totalmoney}</p>
            </div>

            <input type="text" value={name} onChange={handleChangeName} placeholder="플랜 이름" />
            <input type="file" onChange={handleFileChange} />

            <div>
                <Member planId={id} />
            </div>
            <div>
                <Category planId={id} />
            </div>

            <div>
                <Link to={`/plan/${id}/schedule`}>
                    {/* 새로운 창 열기 - 다시 그 창 닫고 플랜 페이지 새로고침이 안 되서 그냥 링크 주소 옮기는 것으로 바꿈 */}
                    <button>스케줄 찾기</button>
                </Link>
                {schedule.map((item) => (
                    <div key={item.id} className="schedule" >
                        <h3>{item.place}</h3>
                        <li>날짜 : {item.date}</li>
                        <li>금액 : {item.money}</li>
                        <button onClick={() => deleteSchedule(item.id)}>스케줄 삭제하기</button>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <Link to={`/plan/${id}/schedule`} className="link-button">
                    <button>스케줄 찾기</button>
                </Link>

                <Link to="/" className="link-button">
                    <button onClick={handleDelete}>플랜 삭제</button>
                </Link>
            </div>
        </div>
    );
}

export default Activeness;
