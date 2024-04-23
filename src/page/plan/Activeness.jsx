import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { Cookies } from 'react-cookie';

import "../../component/plan/Activeness.css";

function Activeness() {
    const cookies = new Cookies();
    const { id } = useParams();

    // 상태 변수 선언 및 초기화
    const [plan, setPlan] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        getPlan();
        fetchCategories();
    }, []);

    // 플랜 조회 함수
    const getPlan = async () => {
        try {
            const token = cookies.get('access_token');

            const response = await axios.get(`http://localhost:3000/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const plan = response.data.findOnePlan;
            const schedule = response.data.findSchedule.schedule;

            setPlan(plan);
            setSchedule(schedule);

            console.log("플랜 조회 내용들 : ", plan);
            console.log("스케줄 목록 : ", schedule);
        } catch (error) {
            handleError(error, "플랜 조회 에러");
        }
    };

    // 카테고리 조회 함수
    const fetchCategories = async () => {
        try {
            const token = cookies.get('access_token');
            const response = await axios.get(`http://localhost:3000/category/plan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            setCategoryOptions(response.data.categories);
        } catch (error) {
            handleError(error, "카테고리 목록 가져오기 에러");
        }
    };

    // 오류 처리 함수
    const handleError = (error, message) => {
        if (error.response) {
            alert("서버 오류: " + error.response.data.message);
        } else if (error.request) {
            alert("서버에 요청할 수 없습니다.");
        } else {
            alert("오류가 발생했습니다: " + error.message);
        }
        console.error(message, error);
    };

    // 카테고리 선택 및 추가 핸들링
    const handleCategory = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleAddCategory = async () => {
        try {
            if (selectedOption) {
                setCategoryOptions([...categoryOptions, { categoryId: Date.now(), category_name: selectedOption }]);
                const token = cookies.get('access_token');

                const response = await axios.post(`http://localhost:3000/category/plan/${id}`,
                    { "category_name": selectedOption },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    });
            }
        } catch (error) {
            handleError(error, "카테고리 생성 에러");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const newOptions = categoryOptions.filter(option => option.categoryId !== categoryId);
            setCategoryOptions(newOptions);

            const token = cookies.get('access_token');
            await axios.delete(`http://localhost:3000/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
        } catch (error) {
            handleError(error, "카테고리 삭제 에러");
        }
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleActiveness = async () => {
        try {
            const token = cookies.get('access_token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);

            const response = await axios.patch(`http://localhost:3000/plan/activeness/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            alert("플랜이 등록되었습니다.");
            getPlan();
        } catch (error) {
            handleError(error, "직접 등록 에러");
        }
    };

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
            handleError(error, "플랜 삭제 에러");
        }
    };

    return (
        <div className="container">
            <div className="plan">
                <h1>{plan.name}</h1>
                <img
                    src={`${process.env.REACT_APP_baseURL}${plan.image}`}
                    alt={plan.name}
                    className="plan-image"
                />
                <p>총 날짜 : {plan.totaldate}</p>
                <p>총 금액 : {plan.totalmoney}</p>
            </div>

            <div className="form-section">
                <div className="form-input-container"> 
                    <input
                        type="text"
                        value={name}
                        onChange={handleChangeName}
                        placeholder="플랜 이름"
                        className="form-input"
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="form-input"
                    />
                </div>
                <div className="form-button-container"> 
                    <button
                        className="form-button"
                        onClick={handleActiveness}
                    >
                        등록
                    </button>
                </div>
            </div>

            <div className="category-section">
                <select
                    value={selectedOption}
                    onChange={handleCategory}
                    className="category-select"
                >
                    <option value="">카테고리 선택</option>
                    <option value="MOUNTAIN">MOUNTAIN</option>
                    <option value="OCEAN">OCEAN</option>
                    <option value="REST">REST</option>
                    <option value="TOUR">TOUR</option>
                    <option value="SINGLE">SINGLE</option>
                    <option value="COUPLE">COUPLE</option>
                    <option value="TEAM">TEAM</option>
                    <option value="QUIET">QUIET</option>
                    <option value="NOISY">NOISY</option>
                </select>
                <button
                    className="category-add-button"
                    onClick={handleAddCategory}
                >
                    추가
                </button>
                {categoryOptions.map((item) => (
                    <div key={item.categoryId} className="category-item">
                        {item.category_name}
                        <button
                            onClick={() => handleDeleteCategory(item.categoryId)}
                            className="category-delete-button"
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>

            <div className="schedule">
                <h2>스케줄 목록</h2>
                {schedule.map((item) => (
                    <div key={item.id} className="schedule-item">
                        <h3>{item.place}</h3>
                        <p>날짜: {item.date}</p>
                        <p>금액: {item.money}</p>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <Link to={`/plan/${id}/schedule`} className="link-button">
                    <button>스케줄 찾기</button>
                </Link>

                <Link to="/" className="link-button">
                    <button onClick={handleDelete}>플랜 삭제</button>
                </Link>
            </div>
        </div>
    );
}

export default Activeness;
