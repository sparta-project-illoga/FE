import axios from "axios";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Cookies } from 'react-cookie';
import { useParams } from "react-router-dom";

import "../../component/schedule/Schedule.css"

function Schedule() {
    const cookies = new Cookies();
    const { id } = useParams();

    //지역코드/키워드로 여행지 검색 위해 받아옴
    const [code, setCode] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [date, setDate] = useState(1);
    const [money, setMoney] = useState(0);;

    //전체 여행지 데이터 저장(왼쪽 화면에 보여주기 위함)
    const [tourData, setTourData] = useState([]);

    //선택한 스케줄 저장(오른쪽 화면에 보여주기 위함)
    const [selectedTours, setSelectedTours] = useState([])

    //선택한 각 스케줄에서 입력받은 날짜, 사용금액 데이터 저장해서 스케줄 아래 보여주기
    const [tourInput, setTourInput] = useState([]);

    //스케줄 생성할 때 입력받는 부분 안 보이게
    const [isInputVisible, setInputVisible] = useState(true);

    //스케줄 전체 조회(전체 조회 버튼 클릭 시 실행)
    const tourlist = async () => {
        try {
            //tourData 배열을 빈 배열로 초기화(다시 호출해서 검색할 수 있게)
            setTourData([]);

            const response = await axios.get(
                "http://localhost:3000/location/tourSpot?page=1&limit=20",
            )

            const schedules = response.data.data;
            setTourData(schedules);
            console.log("schedule 목록 : ", schedules);
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
                console.error("스케줄 전체 조회 에러:", error);
            }
        }
    }

    //지역코드 입력 받아옴
    const handleCode = (event) => {
        const newCode = parseInt(event.target.value);
        setCode(newCode);
    }

    //스케줄 검색(지역코드)
    const searchCode = async () => {
        try {
            //tourData 배열을 빈 배열로 초기화(다시 호출해서 검색할 수 있게)
            setTourData([]);

            console.log("input으로 받아온 지역코드 값 : ", code);

            const response = await axios.get(
                `http://localhost:3000/location/tourSpot/search?areaCode=${code}`,
            )

            const schedules = response.data.data;
            setTourData(schedules);
            console.log("schedule 목록 : ", schedules);
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
                console.error("스케줄 지역코드로 조회 조회 에러:", error);
            }
        }
    }

    //키워드 입력 받아옴
    const handleKeyword = (event) => {
        setKeyword(event.target.value);
    }

    //스케줄 검색(키워드)
    const searchKeyword = async () => {
        try {
            //tourData 배열을 빈 배열로 초기화(다시 호출해서 검색할 수 있게)
            setTourData([]);

            console.log("input으로 받아온 키워드 : ", keyword);

            const response = await axios.get(
                `http://localhost:3000/location/tourSpot/search?keyword=${keyword}`,
            )

            const schedules = response.data.data;
            setTourData(schedules);
            console.log("schedule 목록 : ", schedules);
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
                console.error("스케줄 키워드 조회 에러:", error);
            }
        }
    }

    //각 투어 데이터 클릭시 실행
    const handleTourClick = async (tour) => {
        console.log("클릭된 스케줄 id(placeCode) : ", tour.tourId);
        setSelectedTours(prevTours => [...prevTours, tour]);
    }

    //스케줄 창 닫히고 플랜 페이지 새로고침되는 부분 안 되서 주소 이동으로 바꿈
    const closeWindow = () => {

        window.location.href = `/plan/activeness/${id}`;
    }

    //변경한 날짜 저장
    const handleDate = (event) => {
        const newDate = parseInt(event.target.value);
        setDate(newDate);
    }

    //변경한 금액 저장
    const handleMoney = (event) => {
        const newMoney = parseInt(event.target.value);
        setMoney(newMoney);
    }

    //스케줄 생성 누르면 날짜, 여행지코드, 금액 플랜에 저장됨
    const handleSchedule = async (tourspotId) => {
        try {
            const token = cookies.get('access_token');
            console.log("현재 플랜 id값 : ", id);

            const response = await axios.post(`http://localhost:3000/${id}/schedule`,
                { "date": date, "placecode": tourspotId, "money": money },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            console.log("생성된 스케줄 데이터 : ", response.data);

            alert("스케줄이 생성되었습니다.");

            //다시 date/money 세팅 초기화
            setDate(1);
            setMoney(0);

            // //스케줄 입력받고 나서 입력창 지우기
            // const scheduleContainer = document.getElementById("tourQ");
            // if (scheduleContainer) {
            //     scheduleContainer.style.display = "none";
            // }

            // 입력 필드 숨기기
            setInputVisible(false);

            //밑에 입력받은 값 보여주기 위해서 배열에 값 저장
            setTourInput(prev => [...prev, { "tourspotId": tourspotId, "date": date, "money": money }]);

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
                console.error("스케줄 생성 에러:", error);
            }
        }
    }

    //tourInput 배열 요소 중 tourspotId 값이 일치하는 객체의 값을 출력
    const viewTour = (tourSpotId) => {

        const tour = tourInput.find(item => item.tourspotId === tourSpotId);

        // 조건에 맞는 객체가 없으면 빈 문자열 반환
        if (!tour) return '';

        return (
            <div>
                <p>몇일차 : {tour.date}</p>
                <p>사용 금액 : {tour.money}</p>
            </div>
        );
    };

    return (
        <>
            <div className="schedule">
                <div id="schedule-container">
                    <div>
                        <h1>스케줄 추가</h1>
                        <button onClick={tourlist}>여행지 전체 조회하기</button>
                        <input type="number" id="searchCode" value={code} onChange={handleCode} placeholder="검색어(지역코드)를 입력하세요" />
                        <button onClick={searchCode}>지역코드 검색</button>
                        <input type="text" id="searchKeyword" value={keyword} onChange={handleKeyword} placeholder="검색어(키워드)를 입력하세요" />
                        <button onClick={searchKeyword}>키워드 검색</button>
                    </div>
                    <div className="tourList">
                        {tourData.map((item) => (
                            <div key={item.id} className="tour-item" onClick={() => handleTourClick(item)}>
                                <h2>{item.title}</h2>
                                <p>{item.addr1}</p>
                                <p>{item.areaCode}</p>
                                {item.firstImage && <img src={item.firstImage} alt={item.title} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tour-details">
                    <button onClick={closeWindow}>스케줄 생성 완료</button>
                    {selectedTours.map((tour) => (
                        <div key={tour.id} className="tour-details-content">
                            <h2>{tour.title}</h2>
                            <p>{tour.addr1}</p>
                            <p>{tour.areaCode}</p>
                            {tour.firstImage && <img src={tour.firstImage} alt={tour.title} />}

                            {viewTour(tour.id)}
                            {isInputVisible && (
                                <div id="tourQ" key={tour.id}>
                                    <li>몇 일차 여행지?</li>
                                    <input type="number" value={date} onChange={handleDate} placeholder="여행 날짜" />
                                    <li>이 여행지에서 사용할 금액? </li>
                                    <input type="number" value={money} onChange={handleMoney} placeholder="사용 금액" />
                                    <button onClick={() => handleSchedule(tour.id)}>스케줄 추가하기</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}

export default Schedule;
