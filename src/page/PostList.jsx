import React, { useEffect } from "react";
import axios from "axios";
import '../style/PostList.css'
import HomePost from "../component/HomeBoard";
import { Link } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { plansState }  from '../recoil/atoms';

export default function App() {
  const [plans, setPlans] = useRecoilState(plansState);
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