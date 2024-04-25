import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "../../component/schedule/Schedule.css"
import { REGIONS } from "../../component/Regions";
import Page from "../../component/local/Page";
import Swal from "sweetalert2";

function Schedule() {
    const [cookies] = useCookies(['Authorization']);
    const { id } = useParams();

    //한 페이지에 몇 개 보여줄지 선택,현재 페이지 저장
    const [list, setList] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    //전체 여행지 데이터 몇 개인지 저장(페이지 계산)
    const [total, setTotal] = useState(0);

    //검색 유형(페이지 넘길 때 해당 유형 내의 데이터 중에서 페이지 넘기기)
    const [searchType, setSearchType] = useState("전체 조회");

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
    const [tourInputsVisibility, setTourInputsVisibility] = useState({});

    //선택한 검색 방식(전체/지역/키워드)에 따라서 데이터 가져옴
    const fetchTourData = async () => {
        try {
            let response;
            if (searchType === "전체 조회") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot?page=${currentPage}&limit=${list}`
                );
            } else if (searchType === "지역 검색") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot/search?areaCode=${code}&page=${currentPage}&limit=${list}`
                );
            } else if (searchType === "키워드 검색") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot/search?keyword=${keyword}&page=${currentPage}&limit=${list}`
                );
            }

            setTourData(response.data.data);
            setTotal(response.data.count);
        } catch (error) {
            console.error("데이터 로드 오류:", error);
        }
    };

    //지역코드 입력 받아옴
    const handleCode = (event) => {
        const newCode = parseInt(event.target.value);
        setCode(newCode);
    }

    //지역코드 입력
    const searchCode = async () => {
        setCurrentPage(1);  // 검색 시 1페이지로 돌아감
        setSearchType("지역 검색");  // 지역 검색으로 설정
    };

    //키워드 입력 받아옴
    const handleKeyword = (event) => {
        setKeyword(event.target.value);
    }

    //키워드 입력
    const searchKeyword = async () => {
        setCurrentPage(1);  // 검색 시 1페이지로 설정
        setSearchType("키워드 검색");  // 키워드 검색으로 설정
    };

    //여행지 전체 조회 시 화면에 몇 개 보일지 저장
    const handlePageSize = (event) => {
        setList(parseInt(event.target.value));
        setCurrentPage(1);  // 변경 시 1페이지로 돌아감
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //화면에 보이는 여행지 상태 바뀜(페이지/갯수)
    useEffect(() => {
        fetchTourData();
    }, [currentPage, list, searchType, code, keyword]);

    //키워드 검색 후 다른 타입으로 여행지 조회하면 지역/키워드 부분 값 없어짐
    useEffect(() => {
        if (searchType !== "지역 검색") {
            setCode(0);
        } else if (searchType !== "키워드 검색") {
            setKeyword("");
        }
    }, [searchType]);

    //각 투어 데이터 클릭시 실행(클릭된 스케줄 오른쪽 화면에 추가해서 보여주기기)
    const handleTourClick = async (tour) => {
        console.log("클릭된 스케줄 id(placeCode) : ", tour.tourId);
        setSelectedTours(prevTours => [...prevTours, tour]);
    }

    //선택한 투어가 변경될 때마다 마지막 요소만 true로 설정
    useEffect(() => {
        if (selectedTours.length > 0) {
            const lastTour = selectedTours[selectedTours.length - 1];
            const newVisibility = { ...tourInputsVisibility, [lastTour.id]: true }; // 마지막 투어만 true
            setTourInputsVisibility(newVisibility); // 새로운 가시성 상태 설정
        }
    }, [selectedTours]); // selectedTours가 변경될 때마다 실행

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
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/${id}/schedule`,
                { "date": date, "placecode": tourspotId, "money": money },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, withCredentials: true
                });
            console.log("생성된 스케줄 데이터 : ", response.data);

            Swal.fire({
                text: `스케줄이 생성되었습니다.`,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                  container: 'my-swal',
                },
              });

            //다시 date/money 세팅 초기화
            setDate(1);
            setMoney(0);

            setTourInputsVisibility((prevVisibility) => ({ ...prevVisibility, [tourspotId]: false }))

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
        <div className="schedule">
            <div className="schedule-container">
                <div className="header">
                    <h1>스케줄 추가</h1>
                    <button onClick={() => {
                        setSearchType("전체 조회");
                        setCurrentPage(1);
                    }}>여행지 전체 조회하기</button>
                    <div className="search-container">
                        <div className="search-group">
                            <select
                                value={code}
                                onChange={handleCode}
                            >
                                <option value="">
                                    지역 선택
                                </option>
                                {REGIONS.map((region) => (
                                    <option key={region.areaCode} value={region.areaCode}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={searchCode}>지역 검색</button>
                        </div>
                        <div className="flex-search">
                            <div className="search-group">
                                <input type="text" id="searchKeyword" value={keyword} onChange={handleKeyword} placeholder="키워드 입력" />
                                <button onClick={searchKeyword}>키워드 검색</button>
                            </div>
                            <div className="pagination-controls">
                                <label htmlFor="page-size">페이지 갯수:</label>
                                <select id="page-size" value={list} onChange={handlePageSize}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tourList">
                    {tourData.map((item) => (
                        <div key={item.id} className="tour-item" onClick={() => handleTourClick(item)}>
                            <h2>{item.title}</h2>
                            <p>{item.addr1}</p>
                            {item.firstImage && <img src={item.firstImage} alt={item.title} />}
                        </div>
                    ))}
                </div>

                <Page
                    totalItems={total}
                    itemsPerPage={list}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="tour-details">
                <button className="complete-button" onClick={closeWindow}>스케줄 생성 완료</button>
                {selectedTours.map((tour) => (
                    <div key={tour.id} className="tour-details-content">
                        <h2 className="tour-title">{tour.title}</h2>
                        <p className="tour-address">{tour.addr1}</p>
                        <p className="tour-areaCode">{tour.areaCode}</p>
                        {tour.firstImage && (
                            <img className="tour-image" src={tour.firstImage} alt={tour.title} />
                        )}

                        {viewTour(tour.id)}

                        {tourInputsVisibility[tour.id] && (
                            <div className="tour-inputs">
                                <ul>
                                    <li>
                                        <span>몇 일차 여행지?</span>
                                        <input
                                            type="number"
                                            value={date}
                                            onChange={handleDate}
                                            placeholder="여행 날짜"
                                        />
                                    </li>
                                    <li>
                                        <span>이 여행지에서 사용할 금액?</span>
                                        <input
                                            type="number"
                                            value={money}
                                            onChange={handleMoney}
                                            placeholder="사용 금액"
                                        />
                                    </li>
                                </ul>
                                <button
                                    className="schedule-add-button"
                                    onClick={() => handleSchedule(tour.id)}
                                >
                                    스케줄 추가하기
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Schedule;