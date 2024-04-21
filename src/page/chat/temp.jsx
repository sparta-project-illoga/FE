// 잠깐 쓸 거임 - 플랜에서 채팅방 생성해서 그 채팅방으로 입장

import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { Cookies } from 'react-cookie';

function Temp() {
    const cookies = new Cookies();
    const { id } = useParams();

    const [room, setRoom] = useState('');

    const handleRoom = (event) => {
        setRoom(event.target.value);
    }

    const createChatRoom = async () => {
        try {
            const token = cookies.get('access_token');

            console.log("플랜 id값 : ", id);

            const response = await axios.post(`http://localhost:3000/chat/plan/${id}`,
                { "name": room },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

            const chatRoom = response.data.room;
            console.log("채팅방 생성  : ", chatRoom);

            alert(`${chatRoom.name} 채팅방이 생성되었습니다.`);


            window.location.href = `/plan/chat/${chatRoom.roomId}`;

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
        <div>
            <input type="text" value={room} onChange={handleRoom} placeholder="채팅방 이름" />
            <button onClick={createChatRoom}>채팅방 생성하기</button>
        </div>

    )
}

export default Temp;

