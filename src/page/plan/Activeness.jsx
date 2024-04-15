import axios from "axios";
import React, { useState, useEffect, useParams } from "react";

function Activeness() {
    // const { id } = useParams();
    const [name, setName] = useState(null);
    const [file, setFile] = useState(null);

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    // const handleChangeImage = (event) => {
    //     setImage(event.target.value);
    // }

    // console.log("직접 생성 id : ", id);

    const handleActiveness = async () => {
        try {
            const response = await axios.patch("http://localhost:3000/plan/activeness/:id");
            console.log("activeness-response : ", response);
        } catch (error) {
            console.error("직접 등록 에러:", error);
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.delete("http://localhost:3000/plan/:id");
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
            <h1>직접 등록</h1>
            <input type="text" value={name} onChange={handleChangeName} placeholder="플랜 이름" />
            <button onClick={handleActiveness}>등록</button>

        </div>
    )

}

export default Activeness;