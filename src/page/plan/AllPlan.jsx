import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from '../../component/Likebutton'
// import './PostCard.css'
import defaultImg from "../../asset/profileDefault.jpg"


function AllPlan() {
    const [plans, setPlans] = useState([]);
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/new`)
                setPlans(response.data);
            } catch (error) {
                console.log('정보를 불러오는 데에 실패하였습니다.')
            }
        }
        fetchPlans();
    }, [])


    console.log("plans", plans);

    const imageName = plans ? plans.image : '';
    const fullURL = `${process.env.REACT_APP_baseURL}${imageName}`;
    console.log(fullURL)

    return (
        <div className="card_container">
            <p><h1>플랜 전체 조회하기</h1></p>
            {plans.filter(plan => plan.name).map((plan, index) => (
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

export default AllPlan;