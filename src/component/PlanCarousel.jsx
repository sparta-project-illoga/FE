import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { plansState }  from '../recoil/atoms';
import { filteredPlansSelector, fetchPlans } from '../recoil/selectors'
import axios from "axios";
import logoImg from "../logo.svg";
import LikeButton from './Likebutton';
import './PlanCarousel.css';
import defaultImg from "../asset/profileDefault.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function PlanCarousel() {
  const [plans, setPlans] = useRecoilState(plansState);
  const filteredPlans = useRecoilValue(filteredPlansSelector);
  const plansFromApi = useRecoilValue(fetchPlans);
  
  useEffect(() => {
    setPlans(plansFromApi);
  }, [plansFromApi, setPlans]);

  let sliderRef = useRef(null);

  const next = () => {
    sliderRef.slickNext();
  };

  const previous = () => {
    sliderRef.slickPrev();
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="carousel_container">
      <Slider
        ref={slider => {
          sliderRef = slider;
        }}
        {...settings}
      >
        {filteredPlans.map((plan, index) => (
          <div key={index}>
            <div className="carousel_card">
              <div className="inform_sec">
                <Link to={`/plan/${plan.id}`}>
                  <h1>{plan.name}</h1>
                </Link>
                <p>여행일수 : {plan.totaldate}일</p>
                <p>여행금액 : {plan.totalmoney}원</p>
                <div className="like_sec">
                  <div>좋아요 : {plan.favoriteCount}</div>
                  <div className="like_button">
                    <LikeButton planId={plan.id} />
                  </div>
                </div>
              </div>
              <div className="img_sec">
                <Link to={`/plan/${plan.id}`}>
                  <img src={plan.image && !plan.image.includes("null") ? `${process.env.REACT_APP_baseURL}${plan.image}` : defaultImg} alt="썸네일" className="carousel_img" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="arrow_sec" style={{ textAlign: "center" }}>
        <button className="pre_button" onClick={previous}>
          {"<"}
        </button>
        <button className="next_button" onClick={next}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default PlanCarousel;
