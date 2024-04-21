import axios from "axios";
import React, { useState, useEffect } from "react";

import { useParams } from 'react-router-dom';

import { Cookies } from 'react-cookie';

function Passivity() {
    const cookies = new Cookies();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [placeCode, setPlaceCode] = useState(0);
    const [category, setCategory] = useState("");
    const [money, setMoney] = useState(0);
    const [date, setDate] = useState(0);

    const [plan, setPlan] = useState([]);

    //변경한 이름 저장
    const handleName = (event) => {
        setName(event.target.value);
    }
    //추천 지역코드 저장
    const handlePlaceCode = (event) => {
        setPlaceCode(event.target.value);
    }
    //추천 카테고리 저장
    const handleCategory = (event) => {
        setCategory(event.target.value);
    }
    //추천 금액 저장
    const handleMoney = (event) => {
        setMoney(event.target.value);
    }
    //추천 여행날짜 저장
    const handleDate = (event) => {
        setDate(event.target.value);
    }

    const handlePassivity = async () => {
        try {
            const token = cookies.get('access_token');

            const response = await axios.patch(`http://localhost:3000/plan/passivity/${id}`,
                {
                    "name": name, "placecode": placeCode, "category": category, "money": money, "date": date
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const plan = response.data.schedule;

            console.log(plan);

            setPlan(plan);
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
                console.error("추천 플랜 에러:", error);
            }
        }
    }


    const handleDelete = async () => {
        try {
            const token = cookies.get('access_token');

            await axios.delete(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

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
                console.error("추천 플랜 삭제 에러:", error);
            }
        }
    }

    return (
        <div>
            <h1>추천 등록</h1>

            <input type="text" value={name} onChange={handleName} placeholder="플랜 이름" />
            <li>추천받고 싶은 지역(코드)를 입력하세요. (선택)</li>
            <input type="number" value={placeCode} onChange={handlePlaceCode} placeholder="추천받고 싶은 지역" />
            <li>추천받고 싶은 플랜의 카테고리를 입력하세요. (선택)</li>
            <input type="text" value={category} onChange={handleCategory} placeholder="추천받고 싶은 카테고리" />
            <li>추천받고 싶은 플랜의 최대금액을 입력하세요. (선택)</li>
            <input type="number" value={money} onChange={handleMoney} placeholder="추천받고 싶은 금액" />
            <li>추천받고 싶은 플랜의 여행날짜를 입력하세요. (선택)</li>
            <input type="number" value={date} onChange={handleDate} placeholder="추천받고 싶은 날짜" />

            <button onClick={handlePassivity}>플랜 추천받기</button>

            <div>
                <button onClick={handleDelete}>플랜 생성 취소</button>
            </div>

        </div>
    )
}

export default Passivity;