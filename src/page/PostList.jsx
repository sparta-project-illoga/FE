import React from "react";
import { useState } from "react";
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
    [
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
    ],
    [
        <PostCard title="제목2" author="이진동" />,
        <PostCard title="제목2" author="이진동" />,
        <PostCard title="제목2" author="이진동" />,
        <PostCard title="제목2" author="이진동" />,
        <PostCard title="제목2" author="이진동" />
    ],
    [
        <PostCard title="제목3" author="정유한" />,
        <PostCard title="제목3" author="정유한" />,
        <PostCard title="제목3" author="정유한" />,
        <PostCard title="제목3" author="정유한" />,
        <PostCard title="제목3" author="정유한" />
    ]
  ];
  
  export default function App() {
    const [activeContentIndex, setActiveContentIndex] = useState(0);
  
    return (
      <div>  
        <div id="tabs">
          <menu>
            <button
              className={activeContentIndex === 0 ? "active" : ""}
              onClick={() => setActiveContentIndex(0)}
            >
              전체
            </button>
            <button
              className={activeContentIndex === 1 ? "active" : ""}
              onClick={() => setActiveContentIndex(1)}
            >
              FE
            </button>
            <button
              className={activeContentIndex === 2 ? "active" : ""}
              onClick={() => setActiveContentIndex(2)}
            >
              BE
            </button>
          </menu>
          <div id="tab-content">
            <div className="card_box">
              {content[activeContentIndex].map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  