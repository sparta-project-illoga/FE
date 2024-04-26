import axios from "axios";
import React, { useState, useEffect } from "react";
import "../../component/local/Local.css";

import { REGIONS } from "../../component/Regions";
import Page from "../../component/local/Page";

function Local() {
    //한 페이지에 몇 개 보여줄지 선택
    const [list, setList] = useState(10);

    //현재 페이지 정보 저장
    const [currentPage, setCurrentPage] = useState(1);

    //지역코드/키워드로 여행지 검색 위해 받아옴
    const [keyword, setKeyword] = useState("");

    //전체 여행지 데이터 저장(왼쪽 화면에 보여주기 위함)
    const [tourData, setTourData] = useState([]);

    //전체 여행지 데이터 몇 개인지 저장
    const [total, setTotal] = useState(0);

    //검색 유형(페이지 넘길 때 해당 유형 내의 데이터 중에서 페이지 넘기기)/현재 검색값
    const [searchType, setSearchType] = useState("전체 조회");
    const [searchValue, setSearchValue] = useState("");

    const fetchTourData = async () => {
        try {
            let response;
            if (searchType === "전체 조회") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot?page=${currentPage}&limit=${list}`
                );
            } else if (searchType === "지역 검색") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot/search?areaCode=${searchValue}&page=${currentPage}&limit=${list}`
                );
            } else if (searchType === "키워드 검색") {
                response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/location/tourSpot/keyword?keyword=${keyword}&page=${currentPage}&limit=${list}`
                );
            }

            setTourData(response.data.data);
            setTotal(response.data.count);
        } catch (error) {
            console.error("데이터 로드 오류:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //여행지 전체 조회 시 화면에 몇 개 보일지 저장
    const handlePageSize = (event) => {
        setList(parseInt(event.target.value));
        setCurrentPage(1);  // 변경 시 1페이지로 돌아감
    };

    //화면에 보이는 여행지 상태 바뀜(페이지/갯수)
    useEffect(() => {
        fetchTourData();
    }, [currentPage, list, searchType, searchValue]);

    //키워드 검색 후 다른 타입으로 여행지 조회하면 키워드 부분 값 없어짐
    useEffect(() => {
        if (searchType !== "키워드 검색") {
            setKeyword("");
        }
    }, [searchType]);

    //키워드 입력 받아옴
    const handleKeyword = (event) => {
        setKeyword(event.target.value);
    }

    const searchByRegion = async (regionCode) => {
        setCurrentPage(1);  // 검색 시 1페이지로 돌아감
        setSearchType("지역 검색");  // 지역 검색으로 설정
        setSearchValue(regionCode);  // 지역 코드 저장
    };

    const searchKeyword = async () => {
        setCurrentPage(1);  // 검색 시 1페이지로 설정
        setSearchType("키워드 검색");  // 키워드 검색으로 설정
        fetchTourData();
    };


    return (
        <div className="localInfo">
            <div className="localSearch">
                <button className="getAll" onClick={() => {
                    setSearchType("전체 조회");
                    setCurrentPage(1);
                }}>전체 조회하기</button>
                <div className="local-search">
                    <div className="region-buttons">
                        {REGIONS.map((region) => (
                            <button key={region.areaCode} onClick={() => searchByRegion(region.areaCode)}>
                                {region.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-group">
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

            <div className="LocalList">
                {tourData.map((item) => (
                    <div key={item.id} className="local-item">
                        <h2>{item.title}</h2>
                        <p>{item.addr1}</p>
                        {item.firstImage && <img src={item.firstImage} alt={item.title} />}

                        <div className="tag-container">
                            {item.tourSpotTags.length > 0 ? (
                                item.tourSpotTags.map(tag => (
                                    <span className="tag">#{tag}</span>
                                ))
                            ) : ("")}
                        </div>
                    </div>
                ))}
            </div>

            <Page
                totalItems={total}
                itemsPerPage={list}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div >
    )
}

export default Local;