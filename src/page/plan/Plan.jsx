import axios from "axios";
import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";

import "../../component/plan/Plan.css";
import Activeness from "./Activeness";
import Passivity from "./Passivity";

function Plan() {
    const [id, setId] = useState(null);

    //직접 생성/자동 생성 버튼 누르면 빈 plan 생성
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/plan");
            console.log("createPlan- response : ", response);
            setId(response.data.id);
            console.log("createPlan - id : ", response.data.id);
            console.log("id 잘 저장되는지 확인 : ", id);
        } catch (error) {
            console.log("플랜 생성 에러 : ", error);
        }
    }

    return (
        <>
            <div className="Plan">
                <div className="plan-buttons">
                    <div className="plan 직접 등록">
                        {/* <Link to={`/plan/activeness/${id}`}> */}
                        <Link to='/plan/activeness'>
                            <button onClick={handleSubmit}>직접 등록</button>
                        </Link>
                    </div>
                    <div className="plan 추천 등록">
                        {/* <Link to={`/plan/passivity/${id}`}> */}
                        <Link to='/plan/passivity'>
                            <button onClick={handleSubmit}>추천 등록</button>
                        </Link>
                    </div>
                </div>
                <Link to='/'>
                    <button className="cancel-button">플랜 생성 취소</button>
                </Link>
            </div>
            {/* <Routes>
                {/* <Route path={`/plan/activeness/:id`} element={<Activeness />} key="activeness-link" />
                <Route path={`/plan/passivity/:id`} element={<Passivity />} key="passivity-link" /> */}
            {/* <Route path='/activeness' element={<Activeness />} key="activeness-link" />
                <Route path='/passivity' element={<Passivity />} key="passivity-link" />
            </Routes> */}
        </>
    )
}

export default Plan;
