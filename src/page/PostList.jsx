import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/PostList.css'
import PostCard from "../component/PostCard";
import HomePost from "../component/HomeBoard";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function App() {
  const [cookies] = useCookies(['Authorization']);

  // 로그인 여부를 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 되어 있는지 확인해서 전체 조회 버튼 보여주기
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = cookies.Authorization;
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, [])

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/popular`)
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
        {/* <p className="new_plan_title">최신 플랜</p> */}

        {/* 조건부 렌더링: 로그인 여부에 따라 버튼을 표시 */}
        {/* {isLoggedIn && (
          <Link to="/all/plan">
            <button className="Allplan-button">전체 보기</button>
          </Link>
        )}
        <div>
        <PostCard />
        </div> */}

        {/* <div id="tabs">
          <div id="tab-content">
            <div className="card_box">
              <PostCard />
            </div>
          </div>
        </div> */}
      </div>

      <div>
        <div className="parent_container">
          <div className="local_container">
            <p className="new_plan_title">지역 게시판</p>
            <HomePost />
          </div>

          <div className="like_plan_container">
            <p className="new_plan_title">인기 플랜</p>
            <ul>
              {plans.filter(plan => plan.name).slice(0, 5).map((plan, index) => (

                <li key={index}>
                  <Link to={`/plan/${plan.id}`}>
                    {plan.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}