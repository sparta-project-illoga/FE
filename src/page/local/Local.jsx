import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import "../../component/local/Local.css";

const REGIONS = [
    { areaCode: "1", name: "서울" },
    { areaCode: "2", name: "인천" },
    { areaCode: "3", name: "대전" },
    { areaCode: "4", name: "대구" },
    { areaCode: "5", name: "광주" },
    { areaCode: "6", name: "부산" },
    { areaCode: "7", name: "울산" },
    { areaCode: "8", name: "세종특별자치시" },
    { areaCode: "31", name: "경기도" },
    { areaCode: "32", name: "강원특별자치도" },
    { areaCode: "33", name: "충북" },
    { areaCode: "34", name: "충남" },
    { areaCode: "35", name: "경북" },
    { areaCode: "36", name: "경남" },
    { areaCode: "37", name: "전북특별자치도" },
    { areaCode: "38", name: "전남" },
    { areaCode: "39", name: "제주특별자치도" },
];

function Local() {
    const [cookies] = useCookies(['Authorization']);
    const { id } = useParams();

    //한 페이지에 몇 개 보여줄지 선택
    const [list, setList] = useState(0);

    //지역코드/키워드로 여행지 검색 위해 받아옴
    const [keyword, setKeyword] = useState("");

    //전체 여행지 데이터 저장(왼쪽 화면에 보여주기 위함)
    const [tourData, setTourData] = useState([]);

    //여행지 전체 조회 시 화면에 몇 개 보일지 저장
    const handlePageSize = (event) => {
        console.log("한 페이지에 보이는 여행지 갯수 : ", event.target.value);
        setList(parseInt(event.target.value));
    }

    //스케줄 전체 조회(전체 조회 버튼 클릭 시 실행)
    const tourlist = async () => {
        try {
            //tourData 배열을 빈 배열로 초기화(다시 호출해서 검색할 수 있게)
            setTourData([]);

            const response = await axios.get(
                `http://localhost:3000/location/tourSpot?page=1&limit=${list}`,
            )

            const schedules = response.data.data;
            setTourData(schedules);
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
                console.error("여행지 전체 조회 에러:", error);
            }
        }
    }

    //list 값 바뀔 때마다 화면에 보이는 여행지 바뀜(갯수)
    useEffect(() => {
        tourlist();
    }, [list]);


    // 지역 코드로 여행지 검색
    const searchByRegion = async (regionCode) => {
        try {
            setTourData([]);
            const response = await axios.get(
                `http://localhost:3000/location/tourSpot/search?areaCode=${regionCode}`
            );
            setTourData(response.data.data);
        } catch (error) {
            console.error("지역 코드 검색 오류:", error);
        }
    };

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

    return (
        <div className="localInfo">
            <div className="localSearch">
                <button onClick={tourlist}>전체 조회하기</button>
                <div className="search-container">
                    <div className="region-buttons">
                        {REGIONS.map((region) => (
                            <button key={region.areaCode} onClick={() => searchByRegion(region.areaCode)}>
                                {region.name}
                            </button>
                        ))}
                    </div>

                    <div className="search-group">
                        <input type="text" id="searchKeyword" value={keyword} onChange={handleKeyword} placeholder="키워드 입력" />
                        <button onClick={searchKeyword}>키워드 검색</button>
                    </div>
                </div>
            </div>

            <div className="pagination-controls">
                <label htmlFor="page-size">페이지 크기:</label>
                <select id="page-size" value={list} onChange={handlePageSize}>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>


            <div className="LocalList">
                {tourData.map((item) => (
                    <div key={item.id} className="local-item">
                        <h2>{item.title}</h2>
                        <p>{item.addr1}</p>
                        <p>{item.areaCode}</p>
                        {item.firstImage && <img src={item.firstImage} alt={item.title} />}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Local;