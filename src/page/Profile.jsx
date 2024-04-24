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
import LocalCert from './LocalCert';

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
    <div className='profile-container'>
      <div className='profile_header'>
        <div className='profile_img'>
          <img src={userInfo.image_url ? fullURL : defaultImg} alt="프로필 사진" className="profile-image" />
        </div>
        <div className='profile_info'>
          <div className='profile_name'>
            <p>{userInfo.nickname}</p>
          </div>
          <div className='profile_myplan'>
            <div className='profile-myplan-button'>
              <Link to='/my/plan/room'>
                <button>내 플랜, 채팅방 조회</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  
      <div className='profile_details'>
        <p>이메일: {userInfo.email}</p>
        <p>이름: {userInfo.name}</p>
        <p>휴대폰 번호: {userInfo.phone}</p>
        <p>가입일: {date}</p>
      </div>
  
      <div className='profile_actions'>
        <Link to="/profile/modifyprofile" element={<ModifyProfile />}>
          <button>내정보 수정</button>
        </Link>
        <button>회원탈퇴</button>
      </div>
    </div>
  );
}

export default Profile;
