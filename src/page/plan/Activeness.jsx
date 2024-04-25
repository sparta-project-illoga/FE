import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";

import { useCookies } from 'react-cookie';

import Category from "../category/Category";
import "../../component/plan/Activeness.css"
import Member from "../member/Member";

// 로컬 스토리지 키
const NAME_STORAGE_KEY = "planName";
const FILE_STORAGE_KEY = "planFile";

function Activeness() {
    const [cookies] = useCookies(['Authorization']);
    const { id } = useParams();

    //처음에 플랜에 저장된 내용 조회(내용/스케줄 같이 가져옴)
    const [plan, setPlan] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    // // 페이지 벗어나려 할 때 이름이 없으면 경고
    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         if (!name) {  // 이름이 없으면 페이지 이동을 방지
    //             event.preventDefault();
    //             event.returnValue = '';  // 경고 메시지 브라우저에서 표시
    //         }
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [name]); // `name` 상태가 변경될 때마다 이벤트 리스너 추가/제거

    //플랜 조회해서 내용 가져오기
    //새로고침 시 한 번씩 실행
    const getPlan = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/plan/${id}`, {
                headers: {
                    Authorization: cookies.Authorization
                }, withCredentials: true
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
    }, []);

    // 컴포넌트 마운트 시 로컬 스토리지에서 이름 로드
    useEffect(() => {
        const storedName = localStorage.getItem(NAME_STORAGE_KEY);
        if (storedName) {
            setName(storedName);
        }
    }, []);

    // 컴포넌트 마운트 시 로컬 스토리지에서 이름 로드
    useEffect(() => {
        const storedFile = localStorage.getItem(FILE_STORAGE_KEY);
        if (storedFile) {
            setFile(storedFile);
        }
    }, []);

    //변경한 이름 저장
    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    // 링크 클릭 시 로컬 스토리지에 값 저장
    const handleLinkClick = () => {
        localStorage.setItem(NAME_STORAGE_KEY, name);
        localStorage.setItem(FILE_STORAGE_KEY, file);
    };

    //변경한 file 저장
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    //등록 버튼 누르면 빈 플랜에 변경한 이름, 파일 수정해서 저장
    const handleActiveness = async (event) => {
        try {
            console.log("id값 : ", id);
            console.log("name : ", name);

            // if (!name) {
            //     console.log("플랜 이름이 입력 안 됨");
            //     setIsPlanRegistered(false);
            //     event.preventDefault();
            // } else {
            //     setIsPlanRegistered(true);
            // }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);

            console.log("formData : ", formData);

            const response = await axios.patch(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/plan/${id}/activeness`,
                formData,
                {
                    headers: {
                        Authorization: cookies.Authorization
                    }, withCredentials: true
                });
            console.log("activeness-response.data : ", response.data);
            alert("플랜을 등록하였습니다.");
            getPlan();
            //플랜 등록하고 나서 로컬스토리지에 있던 플랜이름,파일 삭제
            localStorage.removeItem(NAME_STORAGE_KEY);
            localStorage.removeItem(FILE_STORAGE_KEY);
            navigate("/"); // 메인 페이지로 이동 

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
                console.error("직접 등록 에러:", error);
            }
        }
    }

    //플랜 생성 취소 버튼 누르면 이미 전 단계에서 생성된 빈 plan 지우고 다시 home 화면으로 돌아감
    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/plan/${id}`,
                {
                    headers: {
                        Authorization: cookies.Authorization
                    }, withCredentials: true
                });
            alert("플랜이 삭제되었습니다.");
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
            await axios.delete(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/${id}/schedule/${scheduleId}`,
                {
                    headers: {
                        Authorization: cookies.Authorization
                    }, withCredentials: true
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
            <div className="form-section">
                <h2>직접 등록</h2>
                <div className="plan">
                    <h1>{plan.name}</h1>
                    {plan.image && (<img src={`${process.env.REACT_APP_baseURL}${plan.image}`} alt={plan.name} className="plan-image" />)}
                    <p>총 날짜 : {plan.totaldate}</p>
                    <p>총 금액 : {plan.totalmoney}</p>
                </div>

                <input type="text" value={name} onChange={handleChangeName} placeholder="플랜 이름" className="form-input" />
                <input type="file" onChange={handleFileChange} className="form-input" />

                <div>
                    <Member planId={id} />
                </div>
                <div>
                    <Category planId={id} />
                </div>

                <div>
                    <div className="form-schedule-button-container">
                        <Link to={`/plan/${id}/schedule`} onClick={handleLinkClick}>
                            <button className="form-scheudle-button">스케줄 찾기</button>
                        </Link>
                    </div>
                    {schedule.map((item) => (
                        <div key={item.id} className="schedule-card">
                            <h3 className="schedule-title">{item.place}</h3>
                            <ul className="schedule-details">
                                <li className="schedule-item">날짜: <span className="schedule-date">{item.date}</span></li>
                                <li className="schedule-item">금액: <span className="schedule-money">{item.money}</span></li>
                            </ul>
                            <button
                                onClick={() => deleteSchedule(item.id)}
                                className="schedule-delete-button"
                            >
                                스케줄 삭제하기
                            </button>
                        </div>
                    ))}
                </div>

                <div className="button-container">
                    <button
                        onClick={handleActiveness}
                        className="form-button"
                    >
                        등록
                    </button>
                    <Link to="/" className="link-button">
                        <button onClick={handleDelete}>생성 중인 플랜 삭제</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Activeness;