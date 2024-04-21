import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/PostList.css'
import PostCard from "../component/PostCard";
import company1 from '../asset/company1.png'
import company2 from '../asset/company2.jpg'
import company3 from '../asset/company3.jpg'
import company4 from '../asset/company4.jpg'
import company5 from '../asset/company5.jpg'
import company6 from '../asset/company6.jpg'
import company7 from '../asset/company7.jpg'

  
  export default function App() {

    const [plans, setPlans] = useState([]);
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          const response = await axios.get('http://localhost:3000/plan')
          setPlans(response.data);
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
          <PostCard planId={plans.id}/>
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
  