import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logoImg from "../logo.svg"
import LikeButton from './Likebutton'
import './PostCard.css'
import defaultImg from "../asset/profileDefault.jpg"


function PostCard() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/new`)
        setPlans([...response.data].reverse().slice(0, 8));
      } catch (error) {
        console.log('정보를 불러오는 데에 실패하였습니다.')
      }
    }
    fetchPlans();
  }, [])

  const imageName = plans ? plans.image : '';
  const fullURL = `${process.env.REACT_APP_baseURL}${imageName}`;
  console.log(fullURL)

  return (
    <div className="card_container">
      {plans.map((plan, index) => (
          <div key={index} className='post_card'>
          <Link to={`/plan/${plan.id}`}>
            <img src={plans.image !== undefined ? fullURL : defaultImg} alt="썸네일" className='post_thumbnail' />
          </Link>
            <div className='post_footer'>
            <Link to={`/plan/${plan.id}`}>
              <div className='footer_contents'>
                <p>{plan.name} <span className="date_length">{plan.totaldate}일</span></p>
                <p>{plan.totalmoney}</p>
              </div>
            </Link>
              <LikeButton planId={plan.id} />
            </div>
          </div>
      ))}
    </div>
  );
}

export default PostCard