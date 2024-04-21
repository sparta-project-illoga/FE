//내가 속해있는 플랜 보여주고 플랜 수정/채팅방 생성하기

import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { Cookies } from 'react-cookie';

function MyPlan() {
    const cookies = new Cookies();

    //유저가 해당되는 플랜/채팅 가져오기
    const [planRooms, setPlanRooms] = useState([]);

    const [name, setName] = useState("");

    //유저 해당되는 플랜과 채팅방 가져오기
    const getPlanRooms = async () => {
        try {
            const token = cookies.get('access_token');

            const response = await axios.get(`http://localhost:3000/chat/planNchat`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const planRooms = response.data.myPlanChats;

            setPlanRooms(planRooms);

            console.log("플랜 조회 내용들 : ", planRooms);
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

    useEffect(() => {
        getPlanRooms();
    }, []);

    //input으로 입력받은 채팅방 이름 저장
    const handleChangeName = async (event) => {
        setName(event.target.value);
    }

    //만약 해당 플랜의 채팅방 없을 시 채팅방 생성 버튼 눌러 새 채팅방 생성하기
    const handleCreateRoom = async (planId) => {
        try {
            const token = cookies.get('access_token');

            const response = await axios.post(`http://localhost:3000/chat/plan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            console.log("채팅방 생성 내용들 : ", response.data);
            alert(`${response.data.name} 채팅방을 생성하였습니다.`);
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
                console.error("채팅방 생성 에러:", error);
            }
        }
    }

    return (
        <div >

            <h2>플랜 목록</h2>
            {/* 플랜 목록을 화면에 표시 */}
            <ul>
                {plan.map((plan) => (
                    <li key={plan.PlanRoom.plan.id}>
                        {/* 플랜 이름 표시 */}
                        {plan.PlanRoom.plan.name}

                        {/* 룸이 있을 경우 해당 룸으로 이동하는 버튼 표시 */}
                        {plan.PlanRoom.room ? (
                            <Link to={`/chat/${plan.PlanRoom.room.roomId}`}>이동하기</Link>
                        ) : (
                            // 새로운 채팅방 생성을 위한 입력란과 버튼 표시
                            <div>
                                <input type="text" value={name} onChange={handleChangeName} placeholder="채팅방 이름" />
                                <button onClick={() => handleCreateRoom(plan.PlanRoom.plan.id)}>새로운 채팅방 생성하기</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MyPlan;

