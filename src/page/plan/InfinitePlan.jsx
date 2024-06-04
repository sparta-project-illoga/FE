import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import LoadingSpinner from "../../component/LodingSpinner.jsx"
import defaultImg from "../../asset/profileDefault.jpg"

const LikeButton = lazy(() => import('../../component/Likebutton'));

function InfinitePlan() {
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);

  useEffect(() => {
  const loadPlans = async () => {
    if (isLast) return;
    setLoading(true)
    console.log(`Loading data for page: ${page}`); // 페이지 로드 시작 로그
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/all?page=${page}`);
        const { data: newData, meta } = response.data; // meta 정보를 가져와서 처리합니다.
        if (newData.length < 8) {
          setIsLast(true); // 더 이상 데이터가 없음을 나타냄
        }
        setPlans((prevData) => [...prevData, ...newData]);
        setIsLast(page >= meta.last_page); // 페이지 정보를 기반으로 isLast 상태 업데이트
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadPlans();
  }, [page]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && !isLast) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
    });
    const observerTargetElement = document.getElementById("observer");
    if (observerTargetElement) {
      observer.observe(observerTargetElement);
    }
    return () => {
      if (observerTargetElement) {
        observer.unobserve(observerTargetElement);
      }
    };
  }, [loading, isLast]);

  return (
    <>
    <div className='infinite_container'>
    <div className="Allplan-planzip">
    {plans &&
      plans.map((plan, index) => (
        <div key={index} className='post_card'> {/* 마지막 요소에 ref 할당 */}
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
          <Suspense fallback={<div><LoadingSpinner/></div>}>
            <LikeButton planId={plan.id} />
          </Suspense>
        </div>

        </div>
      </div>
      ))}
    {loading && <p>Loading...</p>}
    <div id='observer' style={{height: "10px"}}></div>
      </div>
    </div>
    </>
  )
}

export default InfinitePlan;
