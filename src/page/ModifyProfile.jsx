import React, { useState } from "react";
import '../style/modifyProfile.css'
import axios from "axios";
import { Cookies } from 'react-cookie';
import BlueButton from "../component/BlueButton";
import { useEffect } from 'react';
import Swal from "sweetalert2";

export default function ModifyProfile() {
  const cookies = new Cookies();
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('')
  const [file, setFile] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
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

    const handleChangeNickname = (event) => {
      setNickname(event.target.value);
    }

    const handleChangePhone = (event) => {
      setPhone(event.target.value);
  }

    const handleFileChange = (event) => {
    setFile(event.target.files[0]);
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nickname.trim() === '' && phone.trim() === '' && file === null) {
      alert('닉네임 또는 전화번호를 입력하거나, 파일을 선택하세요.', {
        type: 'error',
        timeout: 3000
      });
      return;
    }

    try {
      const token = cookies.get('access_token');

      const formData = new FormData();
      if (nickname.trim() !== '') {
        formData.append('nickname', nickname);
      }
    
      if (phone.trim() !== '') {
        formData.append('phone', phone);
      }
    
      if (file !== null) {
        formData.append('file', file);
      }

      const response = await axios.patch("http://localhost:3000/user/modify",
      formData,
      {
      headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log('업로드 성공:', response.data);
      Swal.fire({
        text: `개인 정보를 변경하였습니다.`,
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: 'my-swal',
        },
      });
    } catch (error) {
      console.error("에러 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
  }
}

  return (
    <>
    <div className="modify_profile">
    <div className="modify_title">
      개인정보를 변경할 수 있습니다.
    </div>
    <div className="modify_des">
      변경이 필요한 정보를 입력하시고 확인 버튼을 눌러주세요
    </div>
    <div className="modify_contents">
      <div className="modify_nick">
      <p>Nickname</p>
      <input 
        type="text" 
        placeholder={userInfo.nickname}
        value={nickname}
        onChange={handleChangeNickname}
        />
      </div>
      <div className="modify_phone">
      <p>Phone Number</p>
      <input
        type="text" 
        name={userInfo.phone}
        value={phone}
        onChange={handleChangePhone}
        />
      </div>
      <div className="modify_file">
        <p>Profile Image</p>
        <input id="file-upload" type="file" onChange={handleFileChange}/>
      </div>

      <div onClick={handleSubmit}>
      <BlueButton content='정보수정' />
      </div>
    </div>
    </div>
    </>
  )
}
