import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/PostList.css'
import PostCard from "../component/PostCard";
  
  export default function App() {

    const [plans, setPlans] = useState([]);
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/plan/popular`)
          setPlans(response.data);
          console.log(response)
        } catch (error) {
          console.log('정보를 불러오는 데에 실패하였습니다.')
        }
      }
      fetchPlans();
    }, [])


    return (
<div className="main_page">
  <div className="new_plan_container">
    <p className="new_plan_title">최신 플랜</p>
      <div id="tabs">
        <div id="tab-content">
          <div className="card_box">
          <PostCard />
          </div>
        </div>
      </div>
    </div>

  <div>
    <div className="parent_container">
      <div className="local_container">
      <p className="new_plan_title">지역 소개 게시판</p>
      <ul>
        <li>[부산] 광안리 해수욕장 좋아요</li>
        <li>[부산] 광안리 해수욕장 좋아요</li>
        <li>[부산] 광안리 해수욕장 좋아요</li>
        <li>[부산] 광안리 해수욕장 좋아요</li>
        <li>[부산] 광안리 해수욕장 좋아요</li>
      </ul>
      </div>

      <div className="like_plan_container">
      <p className="new_plan_title">인기 플랜</p>
      <ul>
      {plans.slice(0, 5).map((plan, index) => (
        <li key={index}>{plan.name}</li>
      ))}
    </ul>
      </div>
    </div>
  </div>
</div>
    );
  }
  