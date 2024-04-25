import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Swal from "sweetalert2";

import "../../component/plan/Plan.css";

function Plan() {
    const [cookies] = useCookies(['Authorization']);
    //직접 생성/자동 생성 버튼 누르면 빈 plan 생성
    const handleSubmit = async (type) => {
        try {
            const token = cookies.Authorization.replace('Bearer ', ''); 
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/plan`,{},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, withCredentials: true
                }
            )

            const plan = response.data.createPlan.createPlan;
            console.log("Plan - id : ", plan.id);
            Swal.fire({
                text: `플랜이 생성되었습니다.`,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                  container: 'my-swal',
                },
              });

            //직접인지 추천인지 나눠서 주소 이동
            let url;
            if (type === 'activeness') {
                url = `/plan/activeness/${plan.id}`;
            } else if (type === 'passivity') {
                url = `/plan/passivity/${plan.id}`;
            }
            window.location.href = url;

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
                console.error("플랜 생성 에러:", error);
            }
        }
    }

    return (
        <div className="plan-container">
            <div className="plan-buttons">
                <div className="plan-button-wrapper">
                    <button className="plan-button" onClick={() => handleSubmit('activeness')}>직접 등록</button>
                </div>
                <div className="plan-button-wrapper">
                    <button className="plan-button" onClick={() => handleSubmit('passivity')}>추천 등록</button>
                </div>
            </div>
            <Link to='/'>
                <button className="cancel-button">플랜 생성 취소</button>
            </Link>
        </div>
    )
}

export default Plan;
