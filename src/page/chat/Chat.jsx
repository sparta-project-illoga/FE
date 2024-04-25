import axios from "axios";
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import io from 'socket.io-client'
import { useCookies } from 'react-cookie';
import "../../component/chat/Chat.css";

function Chat() {
    const [cookies] = useCookies(['Authorization']);
    //룸id
    const { id } = useParams();

    //현재 채팅방 정보, 멤버,그 전 채팅들 저장
    const [room, setRoom] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    //입력받은 채팅,소켓 저장
    const [text, setText] = useState("")
    const [socket, setSocket] = useState(null);

    // 채팅방 입장 상태(socket.on(joinroom)이 제대로 된 경우만 채팅방 보여줌)
    const [isRoomJoined, setIsRoomJoined] = useState(false);

    //채팅방에 참여한 멤버 저장(유저id) - 화면에서 채팅방 입장한 멤버 이름 옆에 joined라고 뜸
    const [joinedMembers, setJoinedMembers] = useState([]);

    //채팅 치는 중인 사람 보여줌
    const [isTyping, setIsTyping] = useState(false);
    const [typingDisplay, setTypingDisplay] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null); // 타이핑 시간 재기

    //채팅창에 입력한 메시지 저장
    const handleMessage = (event) => {
        const newText = event.target.value;
        setText(newText);

        // 타이핑 시작 또는 중단 
        if (newText.length > 0 && !isTyping) {
            socket?.emit('typing', { "roomId": id, "isTyping": true }); // 입력 중
            setIsTyping(true);

            // 타이핑 타이머 시작 (2초 후에 타이핑 상태 해제)
            resetTypingTimeout();
        } else if (newText.length === 0) {
            resetTypingTimeout(); // 타이머 재설정

        }
    }

    //타이핑 하고 2초 후에 누가 타이핑 중이라는 메시지 없어짐
    const resetTypingTimeout = () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(
            setTimeout(() => {
                setIsTyping(false);
                socket?.emit('typing', { "roomId": id, "isTyping": false }); // 2초 후 타이핑 중단
            }, 2000) // 2초 후 타이핑 해제
        );
    };

    //채팅창 입력한 메시지 서버로 전송
    const send = (text) => {
        socket?.emit('message', { "roomId": room.roomId, "chat": text });
        setText(""); //서버로 메시지 전송 후 입력 창 초기화
        setIsTyping(false); // 메시지 전송 후 타이핑 상태 초기화
    }

    //채팅방 정보/내용 조회
    //조회 시 초대된 멤버만 가능
    const getChat = async () => {
        try {
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat/room/${id}/content`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
            });

            const chat = response.data.chat;

            console.log("채팅방 내용 조회 chat : ", chat);

            setRoom(chat.room);
            setMessages(chat.content);
        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                console.log("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                console.log("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                alert("오류가 발생했습니다: " + error.message);
                console.error("채팅방 정보 조회 에러:", error);
            }
        }
    }

    //채팅방 멤버 조회
    //조회 시 멤버만 가능
    const getMember = async () => {
        try {
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/plan/${room.planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true

            });

            const member = response.data.members;

            console.log("채팅방 멤버 조회 : ", member);

            setMembers(member);

        } catch (error) {
            if (error.response) {
                // 서버로부터 응답이 도착한 경우
                console.log("서버 오류: " + error.response.data.message);
            } else if (error.request) {
                // 요청이 서버에 도달하지 않은 경우
                console.log("서버에 요청할 수 없습니다.");
            } else {
                // 그 외의 경우
                alert("오류가 발생했습니다: " + error.message);
                console.error("채팅방 멤버 조회 에러:", error);
            }
        }

    }

    useEffect(() => {
        const token = cookies.Authorization.replace('Bearer ', ''); 
        const newSocket = io(`${process.env.REACT_APP_API_URL}/events`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
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

            //소켓이 연결되면 채팅방 참여 요청
            socket.on('connect', () => {
                joinRoom();
                console.log("Connected to Server");
            });

            socket.on('joinRoomSuccess', (members) => {
                console.log("룸 입장해 있는 members: ", members);
                setIsRoomJoined(true); //프론트에서 멤버 검증
                setJoinedMembers(members); // 입장 성공 시 멤버 리스트 업데이트
                console.log('채팅방에 입장하였습니다.');
            });

            socket.on('memberJoined', (payload) => {
                console.log(`새 멤버 참여: ${payload.userId}`);
                // 새로운 멤버 참여 - 참여한 멤버 저장
                setJoinedMembers((prev) => [...prev, payload.userId]);
            });

            socket.on('joinRoomFailed', (error) => {
                setIsRoomJoined(false);
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

    }, [socket, id])

    useEffect(() => {
        if (socket) {
            // 서버에서 타이핑 이벤트 수신
            socket.on('typing', (data) => {
                if (data.isTyping) {
                    setTypingDisplay(`${data.nickname} is typing...`); // 타이핑 중인 사용자 표시
                } else {
                    setTypingDisplay(""); // 타이핑 상태 해제
                }
            });

            return () => {
                socket.off('typing'); // 컴포넌트 언마운트 시 이벤트 해제
            };
        }
    }, [socket]);

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

    //채팅방 멤버 아닐 경우 해당 화면 보여줌
    if (!isRoomJoined) {
        return (
            <div>
                <h2>해당 채팅방에 입장할 수 없습니다.</h2>
                <p>채팅방에 참여하려면 초대받은 멤버여야 합니다.</p>
            </div>
        );
    }

    return (
        <div className="background">
            {room && (
                <div className="roomName">
                    <h2>현재 Room 이름 : {room.name}</h2>
                </div>
            )}

            <div className="roomMember">
                <h3>채팅방 멤버</h3>
                <ul>
                    {members.map((m) => (
                        <li key={m.memberId}>
                            <strong>닉네임:</strong> {m.nickname} {joinedMembers.includes(m.userId) ? "(joined)" : ""}
                            <br />
                            <strong>타입:</strong> {m.type} <br />
                        </li>
                    ))}
                </ul>
            </div>

            {messages.map((message) =>
                <div className="chat">{message.name} : {message.chat}</div>
            )}

            <div className="typing">
                {typingDisplay} {/* 타이핑 상태 표시 */}
            </div>

            <div>
                <input className="chatInput" onChange={handleMessage} placeholder="Type your message..." value={text} />
                <button className="chatSendButton" onClick={() => send(text)}>Send</button>
            </div>
        </div>
    )
}

export default Chat;
