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
        setPlans([...response.data].reverse());
        console.log(plans)
      } catch (error) {
        console.log('정보를 불러오는 데에 실패하였습니다.')
      }
    }
    fetchPlans();
  }, [])

  const imageName = plans ? plans.image : '';
  console.log(imageName)
  const fullURL = `${process.env.REACT_APP_baseURL}${imageName}`;
  console.log(fullURL)

  const filteredPlans = plans.filter(plan => plan.type === 'Self').slice(0, 8);

  return (
    <div className="card_container">
      {filteredPlans.map((plan, index) => (
        <div key={index} className='post_card'>
          <Link to={`/plan/${plan.id}`}>
            <img src={plan.image && !plan.image.includes("null") ? `${process.env.REACT_APP_baseURL}${plan.image}` : defaultImg} alt="썸네일" className='post_thumbnail' />
          </Link>
          <div className='post_footer'>
            <div className='footer_contents'>
              <Link to={`/plan/${plan.id}`} className="link-text">
                <p>{plan.name}</p>
              </Link>
              <p className="footer_info">{plan.totaldate}일 · {plan.totalmoney}원</p>
            </div>

            <div className="like_button">
              <LikeButton planId={plan.id} />
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default PostCard