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

    //추천받은 플랜 저장
    const [plan, setPlan] = useState([]);

    //변경한 이름 저장
    const handleName = (event) => {
        setName(event.target.value);
    }
    //추천 지역코드 저장
    const handlePlaceCode = (event) => {
        setPlaceCode(parseInt(event.target.value));
    }
    //추천 카테고리 저장
    const handleCategory = (event) => {
        setCategory(event.target.value);
    }
    //추천 금액 저장
    const handleMoney = (event) => {
        setMoney(parseInt(event.target.value));
    }
    //추천 여행날짜 저장
    const handleDate = (event) => {
        setDate(parseInt(event.target.value));
    }


    const handlePassivity = async () => {
        try {
            const token = cookies.get('access_token');

            // 요청 데이터 생성, 값이 있는 것만 추가
            const requestData = {
                "name": name,
            };

            if (placeCode) {
                requestData.placeCode = placeCode; // 값이 0이 아닐 때만 포함
            }

            if (category.trim()) { // 빈 문자열이 아닌 경우만 포함
                requestData.category = category;
            }

            if (money) {
                requestData.money = money;
            }

            if (date) {
                requestData.date = date;
            }

            const response = await axios.patch(`http://localhost:3000/plan/passivity/${id}`,
                requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const schedule = response.data.schedule;

            console.log("추천받은 schedule : ", schedule);

            setPlan(schedule);
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

            <div>
                <h2>추천된 플랜</h2>
                {plan.length > 0 ? (
                    <ul>
                        {plan.map((item) => (
                            <li key={item.id}>
                                {item.place} - 날짜: {item.date} - 금액: {item.money}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>추천된 플랜이 없습니다.</p>
                )}
            </div>

        </div>
    )
}

export default Passivity;