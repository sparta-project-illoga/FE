import axios from "axios";
import React, { useEffect, useParams } from "react";

function Passivity() {
    // const { id } = useParams();

    console.log("수동 생성 id : ", id);

    const handlePassivity = async () => {
        try {
            const response = await axios.patch("http://localhost:3000/plan/passivity/:id");
            const id = response.data.id;
            window.location.href = `/plan/passivity/${id}`;
        } catch (error) {
            console.error("추천 등록 에러:", error);
        }
    }


    const handleDelete = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.delete("http://localhost:3000/plan");
            console.log("createPlan- response : ", response);
            id = response.data.id;
            console.log("id : ", id);
        } catch (error) {
            console.log("플랜 삭제 에러 : ", error);
        }
    }

    const category = async () => {
        try {
            const response = await axios.post("http://localhost:3000/category/:planId");
            console.log("createPlan- response : ", response);
            // id = response.id;
            // console.log("id : ", id);
        } catch (error) {
            console.log("카테고리 생성 에러 : ", error);
        }

    }

    return (
        <div>
            <h1>추천 등록</h1>
        </div>
    )
}

export default Passivity;