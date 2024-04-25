import axios from "axios";
import React, { useState, useEffect } from 'react';

import { Cookies } from 'react-cookie';

function Category({ planId }) {
    const cookies = new Cookies();

    //지금 받아온 카테고리 저장/지금까지 받아온 카테고리 저장
    const [selectedOption, setSelectedOption] = useState('');
    const [categories, setCategories] = useState([]);

    //해당 플랜에 저장된 카테고리들 조회에서 밑에 보여주기
    const getCategories = async () => {
        try {
            const token = cookies.get('Authorization');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/plan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const category = response.data.categories;

            setCategories(category);

            console.log("플랜에 조회된 카테고리들 : ", category);
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
                console.error("카테고리 목록 가져오기 에러:", error);
            }
        }
    };

    //처음 페이지 넘어갈 때 한 번 플랜에 저장된 내용들(플랜 내용,카테고리,스케줄) 조회해서 가져옴
    useEffect(() => {
        getCategories();
    }, []);

    //현재 추가된 카테고리 저장(1개 바로바로)
    const handleCategory = (event) => {
        console.log("카테고리 : ", event.target.value);
        setSelectedOption(event.target.value);
    }

    //전체 카테고리 추가/서버에서 카테고리 생성(전체 저장/조회)
    const handleAddCategory = async () => {
        try {
            if (selectedOption) {
                setCategories([...categories, selectedOption]);
                setSelectedOption('');
            }

            console.log("방금 추가한 카테고리 1개 : ", selectedOption);

            const token = cookies.get('Authorization');
            console.log("현재 플랜 id값 : ", planId);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/category/plan/${planId}`,
                { "category_name": selectedOption },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            console.log("activeness-category.data : ", response.data);

            const addC = response.data.category;

            setCategories([...categories, { "categoryId": addC.categoryId, "category_name": addC.category_name }]);

            console.log(`${addC.category_name}을 해당 플랜의 카테고리에 추가하였습니다.`);
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
                console.error("카테고리 생성 에러:", error);
            }
        }
    }

    //화면에 추가된 category 옆의 삭제 버튼을 누르면 해당 플랜 카테고리 삭제됨
    const handleDeleteCategory = async (categoryId) => {
        try {
            //카테고리 삭제하면 화면에서 해당 카테고리 바로 없어짐
            const newOptions = categories.filter(option => option.categoryId !== categoryId);
            setCategories(newOptions);

            const token = cookies.get('Authorization');

            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/category/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            const category = response.data.category;
            console.log("삭제한 카테고리 : ", category);

            console.log(`${category.category_name}가 카테고리에서 삭제되었습니다.`)

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
            <h2>카테고리 추가하기</h2>
            <select value={selectedOption} onChange={handleCategory}>
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
            <button onClick={handleAddCategory}>추가</button>
            {categories.map((item) => (
                <div key={item.categoryId}>
                    {item.category_name}
                    <button onClick={() => handleDeleteCategory(item.categoryId)}>삭제</button>
                </div>
            ))}
        </div>
    )
}

export default Category;

