//멤버 추가하기 - 아직 사용x

import axios from "axios";
import React, { useState, useEffect } from 'react';

import { Cookies } from 'react-cookie';

function Member({ planId }) {
    const cookies = new Cookies();

    //지금 받아온 카테고리 저장/지금까지 받아온 카테고리 저장
    //추가할 멤버 일단 멤버 id로 받아옴
    const [selectedmember, setSelectedMember] = useState(0);
    const [members, setMembers] = useState([]);

    //해당 플랜에 추가된 멤버들 조회
    const getMembers = async () => {
        try {
            const token = cookies.get('access_token');
            const response = await axios.get(`http://localhost:3000/member/plan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const member = response.data.members;

            setMembers(member);

            console.log("플랜에 조회된 멤버들 : ", member);
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
                console.error("플랜 멤버 조회 에러:", error);
            }
        }
    };

    //처음 페이지 넘어갈 때 한 번 플랜에 저장된 멤버 조회해서 가져옴
    useEffect(() => {
        getMembers();
    }, []);

    //현재 추가된 멤버 저장
    const handleMember = (event) => {
        setSelectedMember(parseInt(event.target.value));
    }

    //멤버 플랜에 추가함
    const handleAddMember = async () => {
        try {
            if (selectedmember) {
                setMembers([...members, selectedmember]);
                setSelectedMember(0);
            }

            console.log("방금 추가한 멤버 : ", selectedmember);

            const token = cookies.get('access_token');
            console.log("현재 플랜 id값 : ", planId);

            const response = await axios.post(`http://localhost:3000/member/plan/${planId}`,
                { "userId": selectedmember },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

            console.log("멤버추가 : ", response.data.member);

            const addM = response.data.member;

            setMembers([...members, { "memberId": addM.memberId, "userId": addM.userId, "nickname": addM.nickname, "type": addM.type }]);

            console.log(`${addM.nickname}을 해당 플랜의 멤버로 추가하였습니다.`);
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
                console.error("멤버 추가 에러:", error);
            }
        }
    }

    //멤버 옆의 삭제 버튼 누르면 해당 멤버 삭제
    const handleDeleteMember = async (memberId) => {
        try {
            //카테고리 삭제하면 화면에서 해당 카테고리 바로 없어짐
            const newMembers = members.filter(option => option.memberId !== memberId);
            setMembers(newMembers);

            const token = cookies.get('access_token');

            const response = await axios.delete(`http://localhost:3000/member/${memberId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

            const member = response.data.member;
            console.log("삭제한 멤버 : ", member);

            console.log(`${member.nickname}}가 카테고리에서 삭제되었습니다.`)

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
                console.error("카테고리 삭제 에러:", error);
            }
        }
    }

    return (
        <div>
            <h2>멤버 추가하기</h2>
            <input type="number" value={selectedmember} onChange={handleMember} placeholder="추가하려는 멤버(유저id)를 입력하세요." />
            <button onClick={handleAddMember}>멤버 추가</button>
            {members.map((m) => (
                <div key={m.memberId}>
                    {m.nickname}({m.type})
                    {/* 'Leader' 타입인 경우 삭제 버튼이 표시되지 않도록 조건 추가 */}
                    {m.type !== 'Leader' && (
                        <button onClick={() => handleDeleteMember(m.memberId)}>삭제</button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Member;

