import React from 'react';
import profileImg from '../logo.svg';
import '../style/Profile.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import BlueButton from "../component/BlueButton";
import { Cookies } from 'react-cookie';
import { Link } from "react-router-dom";
import ModifyProfile from "../page/ModifyProfile"
import defaultImg from "../asset/profileDefault.jpg"
import LocalCert from './lacalCert';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = cookies.get('access_token')
        const response = await axios.get('http://localhost:3000/user/info', {
          headers: {
            Authorization: `Bearer ${token}`
          }, withCredentials: true
        }
        );
        setUserInfo(response.data);
        console.log(response)
      } catch (error) {
        console.error('회원 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchUserInfo();
  }, []);
  // useEffect 사용시 아직 정보를 불러오지 못했을 때를 커버
  if (!userInfo) {
    return <div>회원 정보를 불러오는 중입니다...</div>;
  }

  const imageName = userInfo ? userInfo.image_url : '';
  const fullURL = `${process.env.REACT_APP_baseURL}${imageName}`;
  console.log(fullURL)

  const dateString = userInfo ? userInfo.created_at : '';
  const date = dateString.substring(0, 10);

  return (
    <div className='profile_main'>
      <div className='profile_header'>
        <div className='profile_img'>
          <img src={userInfo.image_url ? fullURL : defaultImg} alt="프로필 사진" id="profile_img"/>
          <div className='profile_name'>
            <p>{userInfo.nickname}</p>
          </div>
        </div>
        <div className='profile_info'>
          <div className='follow_info'>
            <div className='follow_count'>
              <p className='count'>30</p>
              <p className='label'>팔로워</p>
            </div>

            <div className='follow_count'>
              <p className='count'>12</p>
              <p className='label'>팔로우</p>
            </div>

            <div className='follow_button'>
              <button>팔로우하기</button>
            </div>
          </div>
          <div className='introduction'>
            <p>소개글 내용</p>
          </div>
        </div>
      </div>

      <div className='profile_id'>
        <p>이메일: {userInfo.email}</p>
        <p>이름: {userInfo.name}</p>
        <p>휴대폰 번호: {userInfo.phone}</p>
        <p>가입일: {date}</p>
      </div>

      <Link to="/my/plan/room">내 플랜/채팅방 보기</Link>

      {/* <div className='profile_array'>
        <p><span>상태 : </span> 구직 중</p> 
        <p>게시글 수: 1개</p>
      </div> */}

      <div className='profile_button'>
      <Link to="/profile/modifyprofile" element={<ModifyProfile/>}>
      <BlueButton content="내정보 수정"/>
      </Link>{" "}
      
      <BlueButton content="회원탈퇴"/>
      <LocalCert />
      </div>
    </div>
  );
}

export default Profile;
