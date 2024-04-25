import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import "../../component/member/Member.css"

function Member({ planId }) {
    const [cookies] = useCookies(['Authorization']);
    const token = cookies.Authorization.replace('Bearer ', ''); 
    //지금 받아온 카테고리 저장/지금까지 받아온 카테고리 저장
    //추가할 멤버 일단 멤버 id로 받아옴
    const [selectedmember, setSelectedMember] = useState("");
    const [members, setMembers] = useState([]);

    //해당 플랜에 추가된 멤버들 조회
    const getMembers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/plan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
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
        setSelectedMember(event.target.value);
    }

    //멤버 플랜에 추가함
    const handleAddMember = async () => {
        try {
            if (selectedmember) {
                setMembers([...members, selectedmember]);
                setSelectedMember("");
            }

            console.log("방금 추가한 멤버 : ", selectedmember);
            console.log("현재 플랜 id값 : ", planId);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/member/plan/${planId}`,
                { "nickname": selectedmember }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
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

            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/member/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, withCredentials: true
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
        <div className="add-member-container">
            <h2 className="add-member-title">멤버 추가하기</h2>
            <input
                className="add-member-input"
                type="text" // 'string' 타입은 존재하지 않으므로 'text'로 수정
                value={selectedmember}
                onChange={handleMember}
                placeholder="추가하려는 멤버의 닉네임을 입력하세요."
            />
            <button className="add-member-button" onClick={handleAddMember}>멤버 추가</button>
            <div className="member-list">
                {members.map((m) => (
                    <div key={m.memberId} className="member-item">
                        <span className="member-info">{m.nickname} ({m.type})</span>
                        {/* 'Leader' 타입인 경우 삭제 버튼이 표시되지 않도록 조건 추가 */}
                        {m.type !== 'Leader' && (
                            <button className="delete-member-button" onClick={() => handleDeleteMember(m.memberId)}>삭제</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Member;

