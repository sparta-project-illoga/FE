import React from "react";
import '../style/PostList.css'
import PostCard from "../component/PostCard";
import company1 from '../asset/company1.png'
import company2 from '../asset/company2.jpg'
import company3 from '../asset/company3.jpg'
import company4 from '../asset/company4.jpg'
import company5 from '../asset/company5.jpg'
import company6 from '../asset/company6.jpg'
import company7 from '../asset/company7.jpg'




const content = [
        <PostCard title="FE developer 모집" author="OKKY" img={company1} />,
        <PostCard title="Cloud Solution PM" author="오케스트로" img={company2} />,
        <PostCard title="IT 주니어 개발자 모집(전분야)" author="김진성" img={company5} />,
        <PostCard title="devOps 엔지니어 모집" author="메가존클라우드" img={company4} />,
        <PostCard title="devOps 엔지니어 모집" author="메가존클라우드" img={company4} />,
        <PostCard title="Java 개발자 모집(경력 1~3년)" author="애기야가자" img={company5} />,
        <PostCard title="PHP devloper 모집" author="쿨스" img={company3} />,
        <PostCard title="어플리케이션 개발자 모집" author="쿨스" img={company3} />,
        <PostCard title="Windows System 개발자" author="시어스테크놀로지" img={company6} />,
        <PostCard title="IT 주니어 개발자 모집(전분야)" author="다큐브" img={company7} />,
        <PostCard title="IT 주니어 개발자 모집(전분야)" author="다큐브" img={company7} />,
        <PostCard title="IT 주니어 개발자 모집(전분야)" author="트리노드" img={company6} />,
  ];
  
  export default function App() {
  
    return (
  <>
  <div className="new_plan_container">
    <p className="new_plan_title">새로 등록된 플랜</p>
      <div id="tabs">
        <div id="tab-content">
        {content.map((item, index) => (
          <div key={index} className="card_box">
            {item}
          </div>
        ))}
        </div>
      </div>
    </div>

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
    <p className="new_plan_title">내가 좋아한 플랜</p>
    <ul>
      <li>강릉여행 코스</li>
      <li>전라도 식도락 여행</li>
      <li>제주도 한달여행</li>
      <li>경주 당일치기 코스</li>
      <li>[부산] 광안리 해수욕장 좋아요</li>
    </ul>
    </div>
  </div>
  </>
    );
  }
  