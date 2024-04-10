import React from 'react';
import profileImg from '../logo.svg';
import '../style/Profile.css';
import BlueButton from "../component/BlueButton";

function Profile() {
  return (
    <div className='profile_main'>
      <div className='profile_header'>
        <div className='profile_img'>
          <img src={profileImg} alt="프로필 사진" />
          <div className='profile_name'>
            <p>이름</p>
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
        <p><span>이메일 : </span> jskim4695@naver.com</p> 
      </div>

      <div className='profile_array'>
        <p><span>상태 : </span> 구직 중</p> 
        <p>게시글 수: 1개</p>
      </div>

      <div className='profile_button'>
      <BlueButton content="내정보 수정"/>
      <BlueButton content="회원탈퇴"/>
      </div>
    </div>
  );
}

export default Profile;
