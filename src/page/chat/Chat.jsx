import axios from "axios";
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import io from 'socket.io-client'
import { useCookies } from 'react-cookie';

function Chat() {
    const [cookies] = useCookies(['Authorization']);

    console.log("쿠키 정보 cookies : ", cookies);

    //룸id
    const { id } = useParams();

    //현재 채팅방 정보, 멤버,그 전 채팅들 저장
    const [room, setRoom] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    //입력받은 채팅,소켓 저장
    const [text, setText] = useState("")
    const [socket, setSocket] = useState(null);

    //채팅방에 참여한 멤버 저장
    const [joinedMembers, setJoinedMembers] = useState([]);

    // //채팅 치는 중인 사람 보여줌
    // const [isTyping, setIsTyping] = useState(false);
    // const [typingDisplay, setTypingDisplay] = useState('');

    //채팅창에 입력한 메시지 저장
    const handleMessage = (event) => {
        const newText = event.target.value;
        setText(newText);
    }

    //채팅창 입력한 메시지 서버로 전송
    const send = (text) => {
        console.log("send 부분 내용 : ", text);
        socket?.emit('message', { "roomId": room.roomId, "chat": text });
    }

    //채팅방 정보/내용 조회
    const getChat = async () => {
        try {
            console.log("roomId : ", id);

            const response = await axios.get(`http://localhost:3000/chat/room/${id}/content`, {
                headers: {
                    Authorization: cookies.Authorization
                }, withCredentials: true
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

    //채팅방 멤버 조회
    const getMember = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/member/plan/${room.planId}`, {
                headers: {
                    Authorization: cookies.Authorization
                }, withCredentials: true

            });

            const member = response.data.members;

            console.log("채팅방 멤버 조회 : ", member);

            setMembers(member);

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
                console.error("채팅방 멤버 조회 에러:", error);
            }
        }

    }

    useEffect(() => {
        console.log("소켓 보내는 쿠키 : ", cookies.Authorization);

        const newSocket = io("http://localhost:3000/events", {
            extraHeaders: {
                Authorization: cookies.Authorization
            }, withCredentials: true
        });

        setSocket(newSocket);
        getChat();
    }, [setSocket])

    useEffect(() => {
        // room 정보가 설정되었을 때 멤버 조회
        if (room) {
            getMember();
        }
    }, [room]); // room 상태가 변경될 때 getMember 실행

    useEffect(() => {
        if (socket) {
            //채팅방 참여하기(현재 유저가 채팅방 들어옴)
            //채팅방 링크로 멤버가 들어오면 그 멤버가 플랜에 초대된 멤버인지 서버 쪽에서 검증 후 맞으면 joinRoom
            const joinRoom = () => {
                socket.emit('joinRoom', { roomId: id });
            };

            socket.on('connect', () => {
                joinRoom();
                console.log("Connected to Server");
            }); // 소켓 연결되면 채팅방 참여 요청

            socket.on('joinRoomSuccess', () => {
                console.log('채팅방에 입장하였습니다.');
            });

            socket.on('memberJoined', (payload) => {
                console.log(`새 멤버 참여: ${payload.userId}`);
                // 새로운 멤버 참여 - 참여한 멤버 저장
                setJoinedMembers((prev) => [...prev, payload.userId]);
            });

            socket.on('joinRoomFailed', (error) => {
                console.error('채팅방 입장 실패 :', error.message);
                alert('방에 참여할 수 없습니다.');
            });

            return () => {
                socket.off('connect', joinRoom); // 컴포넌트 언마운트 시 이벤트 해제
                socket.off('memberJoined'); // 추가된 이벤트 해제
                socket.off('joinRoomFailed');
                socket.off('joinRoomSuccess'); // 연결 해제 시 이벤트 해제
            };
        }

    }, [socket])

    useEffect(() => {
        //서버에서 저장한 채팅 내용 가져옴
        const messageListener = (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        }

        socket?.on('responseMessage', messageListener)

        return () => {
            socket?.off('responseMessage');
        }
    }, [socket])

    return (
        <div>
            {room && (
                <div>
                    <h2>현재 Room 이름 : {room.name}</h2>
                </div>
            )}

            <h3>채팅방 멤버</h3>
            <ul>
                {members.map((m) => (
                    <li key={m.memberId}>
                        <strong>닉네임:</strong> {m.nickname} {joinedMembers.includes(m.memberId) ? "(joined)" : ""}
                        <br />
                        <strong>타입:</strong> {m.type} <br />
                    </li>
                ))}
            </ul>

            {messages.map((message) =>
                <div>{message.name} : {message.chat}</div>
            )}


            <input onChange={handleMessage} placeholder="Type your message..." value={text} />
            <button onClick={() => send(text)}>Send</button>
        </div>
    )
}

export default Chat;
