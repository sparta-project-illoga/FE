// import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// import { Cookies } from 'react-cookie';

// function Chat() {
//     const cookies = new Cookies();

//     const [socket, setSocket] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [chatRooms, setChatRooms] = useState([]);

//     const [value, setValue] = useState("")

//     useEffect(() => {
//         const token = cookies.get('access_token');

//         const newSocket = io("http://localhost:3001/events", {
//             extraHeaders: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
//         setSocket(newSocket);

//         //컴포넌트가 언마운트될 때 소켓 연결을 끊기 위한 클린업 함수. 컴포넌트가 소멸될 때 소켓 연결도 해제
//         return () => {
//             newSocket.disconnect();
//         };
//     }, []);

//     const send = (message) => {
//         if (socket) {
//             socket.emit('message', message);
//         }

//         setMessages(prevMessages => [...prevMessages, message]);
//         setValue(""); // 메시지 전송 후 입력 필드 비우기
//     }

//     // useEffect(() => {
//     //     // 서버에 해당 roomId에 입장하고자 함을 알림
//     //     socket.emit('joinRoom', roomId);

//     //     return () => {
//     //         // 컴포넌트가 언마운트될 때 채팅방에서 나가는 것을 서버에 알림
//     //         socket.emit('leaveRoom', roomId);
//     //     };
//     // }, [socket, roomId]);

//     //     const joinRoom = async () => {
//     //         const token = cookies.get('access_token');

//     //         // 데이터 객체를 중괄호로 감싸고, roomId와 headers를 속성으로 포함시킵니다.
//     //         const data = {
//     //             roomId: roomId,
//     //             headers: {
//     //                 Authorization: `Bearer ${token}`
//     //             },
//     //             withCredentials: true
//     //         };

//     //         // 서버에 joinRoom 이벤트와 함께 데이터 객체를 전송합니다.
//     //         socket.emit('joinRoom', data);
//     //     };

//     //     return () => {
//     //         // 컴포넌트가 언마운트될 때 채팅방에서 나가는 것을 서버에 알림
//     //         socket.emit('leaveRoom', roomId);
//     //     };
//     // }

//     const connect = async () => {
//         try {
//             socket.emit('connected', () => {
//                 console.log('서버에 연결됨');
//             });
//         } catch (error) {
//             if (error.response) {
//                 // 서버로부터 응답이 도착한 경우
//                 alert("서버 오류: " + error.response.data.message);
//             } else if (error.request) {
//                 // 요청이 서버에 도달하지 않은 경우
//                 alert("서버에 요청할 수 없습니다.");
//             } else {
//                 // 그 외의 경우
//                 alert("오류가 발생했습니다: " + error.message);
//                 console.error("클라이언트 연결 에러:", error);
//             }
//         }
//     }

//     useEffect(() => {
//         //connect();

//         socket.on('connected', () => {
//             console.log("서버에 연결되었습니다.")
//         })
//     }, [])


//     // useEffect(() => {
//     //     if (!socket) return;

//     //     socket.on('newRoom', (room) => {
//     //         console.log(`${room.name} 채팅방이 생성되었습니다.`);
//     //         setChatRooms(prevRooms => [...prevRooms, `${room.name} 채팅방이 생성되었습니다.`]);
//     //     });

//     //     socket.on('addMember', (member) => {
//     //         console.log(`${member.name}이 초대되었습니다.`);
//     //     });

//     //     socket.on('newMessage', (message) => {
//     //         console.log("새로운 메시지: ", message);
//     //         setMessages(prevMessages => [...prevMessages, message]);
//     //     });

//     //     return () => {
//     //         socket.off('connected');
//     //         socket.off('newRoom');
//     //         socket.off('addMember');
//     //         socket.off('newMessage');
//     //     };
//     // }, [socket]);

//     return (
//         <>
//             <input onChange={(e) => setValue(e.target.value)} placeholder="Type your message..." value={value} />
//             <button onClick={() => send(value)}>Send</button>

//             <div>
//                 <h2>채팅방 생성 메시지:</h2>
//                 <ul>
//                     {messages.map((message, index) => (
//                         <li key={index}>{message}</li>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     )
// }

// export default Chat;


// import { useEffect, useState } from 'react'

// import './App.css'
// import io, { Socket } from 'socket.io-client'
// import MessageInput from './Messages/MessageInput'
// import Messages from './Messages/Message'

// function App() {
//   const [socket, setSocket] = useState<Socket>()
//   const [messages, setMessages] = useState<string[]>([])

//   const send = (value: string) => {
//     console.log("send 부분 value : ", value);
//     socket?.emit('message', value)
//   }

//   useEffect(() => {
//     const newSocket = io("http://localhost:3001/events")
//     setSocket(newSocket)
//   }, [setSocket])

//   //emit 후에 gateway 부분에서 이벤트 발생하면 실행
//   const messageListener = (message: string) => {
//     console.log("messageListener에서 message가 뭔지 : ", message);
//     setMessages([...messages, message])
//   }

//   useEffect(() => {
//     socket?.on('connected', () => {
//       console.log('Connected to server');
//     });

//     socket?.on('message', messageListener)

//     socket?.on('responseMessage', (message) => {
//       console.log("responseMessage : ", message);
//     })
//     return () => {
//       socket?.off('connected');
//       socket?.off('message', messageListener);
//       socket?.off('responseMessage');
//     }
//   }, [messageListener])
//   return (
//     <>
//       {" "}
//       <MessageInput send={send} />
//       <Messages messages={messages} />
//     </>
//   )
// }

// export default App

////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from 'react'

import io, { Socket } from 'socket.io-client'

import { Cookies } from 'react-cookie';

function App() {
    const cookies = new Cookies();

    const [value, setValue] = useState("")
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);

    const send = (value) => {
        console.log("send 부분 value : ", value);
        socket?.emit('message', value)
    }

    useEffect(() => {
        const token = cookies.get('access_token');

        const newSocket = io("http://localhost:3001/events", {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        setSocket(newSocket)
    }, [setSocket])

    console.log("messages : ", messages);

    useEffect(() => {
        socket?.on('connected', () => {
            console.log('Connected to server');
        });

        socket?.on('newRoom', (room) => {
            console.log("room : ", room);
            console.log(`${room.name} 채팅방이 생성되었습니다.`);
            setChatRooms(prevRooms => [...prevRooms, `${room.name} 채팅방이 생성되었습니다.`]);
        })

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
            {/* 생성된 채팅방 목록 출력 */}
            <div>
                <h2>채팅방 생성 메시지:</h2>
                <ul>
                    {chatRooms.map((room, index) => (
                        <li key={index}>{room}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default App
