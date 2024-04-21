import axios from "axios";
import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import io, { Socket } from 'socket.io-client'
import { Cookies } from 'react-cookie';

function App() {
    const cookies = new Cookies();
    const { id } = useParams();

    const [value, setValue] = useState("")
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);

    const send = (value) => {
        console.log("send 부분 value : ", value);
        socket?.emit('message', value)
    }

    //채팅방 정보/내용 조회
    const getChat = async () => {
        try {
            const token = cookies.get('access_token');

            console.log("roomId : ", id);

            const response = await axios.get(`http://localhost:3000/chat/room/${id}/content`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const chat = response.data.chat;

            console.log("채팅방 내용 조회 chat : ", chat);

            setRoom(chat.room);
            setMessages(chat.content);

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
                console.error("채팅방 정보 조회 에러:", error);
            }
        }
    }

    useEffect(() => {
        const token = cookies.get('access_token');

        const newSocket = io("http://localhost:3001/events", {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        setSocket(newSocket)
        getChat();
    }, [setSocket])

    useEffect(() => {
        socket?.on('connected', () => {
            console.log('Connected to server');
        });

        socket?.on('addMember', (member) => {
            console.log("member : ", member);
            console.log(`${member.name}이 초대되었습니다.`);
        })

        socket?.on('newMessage', (message) => {
            console.log("newMessage : ", message);
        })

        return () => {
            socket?.off('connected');
            socket?.off('newRoom');
            socket?.off('addMember');
            socket?.off('newMessage');
        }
    }, [socket])

    useEffect(() => {
        const messageListener = (message) => {
            console.log("messageListener에서 message가 뭔지 : ", message);
            setMessages(prevMessages => [...prevMessages, message]);
        }

        socket?.on('responseMessage', messageListener)

        return () => {
            socket?.off('responseMessage');
        }
    }, [socket])

    return (
        <>
            <input onChange={(e) => setValue(e.target.value)} placeholder="Type your message..." value={value} />
            <button onClick={() => send(value)}>Send</button>
            {messages.map((message, index) =>
                <div key={index}>{message}</div>
            )}

            {room && (
                <div>
                    <h2>현재 Room 이름</h2>
                    <p>{room.name}</p>
                </div>
            )}
        </>
    )
}

export default App
