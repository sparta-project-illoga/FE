import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Swal from "sweetalert2";

import '../style/MyPlanRooms.css'

function MyPlanNRooms() {
    const [cookies] = useCookies(['Authorization']);
    //유저가 해당되는 플랜/채팅 가져오기
    const [planRooms, setPlanRooms] = useState([]);

    //유저 해당되는 플랜과 채팅방 가져오기
    const getPlanRooms = async () => {
        try {
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat/planNchat`, {
                headers: {
                   Authorization: `Bearer ${token}`
                }, withCredentials: true
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

    //만약 해당 플랜의 채팅방 없을 시 채팅방 생성 버튼 눌러 새 채팅방 생성하기
    const handleCreateRoom = async (planId) => {
        const roomName = window.prompt("채팅방 이름을 입력하세요:");

        if (!roomName) {
            alert("채팅방 이름을 입력해야 합니다.");
            return;
        }

        try {
            console.log("플랜의 채팅방 생성하기 planId", planId);
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/chat/plan/${planId}`,
                { "name": roomName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
            });

            console.log("채팅방 생성 내용들 : ", response.data);
            Swal.fire({
                text: `${response.data.room.name} 채팅방을 생성하였습니다.`,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                  container: 'my-swal',
                },
              });

            // 채팅방 생성 후 페이지 새로고침
            window.location.reload();
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
        <div className="myplanroom-list">
            <h2 className="myplanroom-heading">플랜과 채팅방 목록</h2>
            {/* 플랜 목록을 화면에 표시 */}
            <ul className="myplanroom-list-ul">
                {planRooms.map((pr) => (
                    <li key={pr.PlanRoom.plan.id} className="myplanroom-list-li">
                        {/* 플랜 이름 표시 */}
                        <div className="myplanroom-plan-name">
                            <Link to={`/plan/${pr.PlanRoom.plan.id}`} className="myplanroom-plan-link">
                                {pr.PlanRoom.plan.name}
                            </Link>
                        </div>
                        <div className="myplanroom-action">
                            {/* 룸이 있을 경우 해당 룸으로 이동하는 버튼 표시 */}
                            {pr.PlanRoom.room ? (
                                <Link to={`/chat/${pr.PlanRoom.room.roomId}`} className="myplanroom-chat-link">채팅방 이동하기</Link>
                            ) : (
                                // 새로운 채팅방 생성을 위한 버튼 표시(버튼 클릭 시 이름 입력할 창 뜸)
                                <button onClick={() => handleCreateRoom(pr.PlanRoom.plan.id)}className="myplanroom-create-chat-button">채팅방 생성하기</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyPlanNRooms;

