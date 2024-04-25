import React, { useState } from "react";
import "../style/signup.css";
import BlueButton from "../component/BlueButton";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
    check_pw: "",
    nickname: "",
    phone: "",
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    const { email, name, password, check_pw, nickname, phone } = userData;
    if (!email || !name || !password || !check_pw || !nickname || !phone) {
      alert("정보를 모두 기입해 주셔야 회원가입을 완료하실 수 있습니다.");
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/user/register`, userData);
      console.log(response.data);
      alert("회원가입이 완료되었습니다.");
      navigate('/')
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const sendVerificationCode = async () => {
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/user/register?type=sendmail`, {
        email: userData.email,
      });
      console.log('인증번호가 전송되었습니다:', response.data);
      alert("인증번호가 전송되었습니다. 이메일을 확인해주세요.");
      setIsEmailSent(true)
    } catch (error) {
      console.error('인증번호 전송 중 오류가 발생했습니다:', error);
      alert("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const verifyCode = async () => {
    if (!userData.verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/user/register?type=verifycode`, {
        email: userData.email,
        code: userData.verificationCode, // 입력받은 인증번호
      });
      console.log('인증 성공:', response.data);
      alert("인증에 성공했습니다.");
    } catch (error) {
      console.error('인증 중 오류가 발생했습니다:', error);
      alert("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="register_container">
      <div className="register_title">
        <p>회원가입하기</p>
        <p className="register_des">
          이메일을 정확하게 입력해주세요. <br /> 인증메일을 받아 회원가입을 완료할 수 있습니다.
        </p>
      </div>

      <div className="register_contents">
        <div>
        <p>이메일을 입력해주세요 <span className="star">*</span></p>
        <input
          type="input"
          className="register_email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
          <button className="send-verification-btn" onClick={sendVerificationCode}>
            인증메일 전송
          </button>
          </div>
          {isEmailSent && (
            <div className="verify-box">
              <input
                type="text"
                className="verification_input"
                id="verification_input"
                name="verificationCode"
                value={userData.verificationCode}
                onChange={handleChange}
              />
              <button className="verify-btn" id="verify-btn" onClick={verifyCode}>
                인증번호 확인
              </button>
            </div>
          )}
        <p>이름을 입력해주세요 <span className="star">*</span></p>
        <input
          type="input"
          className="register_name"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        <p>비밀번호를 입력해주세요 <span className="star">*</span></p>
        <input
          type="input"
          className="register_password"
          placeholder="8자리의 숫자와 영문의 조합으로 입력해주세요."
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <p>비밀번호를 확인해주세요 <span className="star">*</span></p>
        <input
          type="input"
          className="register_check_pw"
          placeholder="비밀번호와 동일하게 입력해주세요."
          name="check_pw"
          value={userData.check_pw}
          onChange={handleChange}
        />
        <p>닉네임을 입력해주세요</p>
        <input
          type="input"
          className="register_nickname"
          name="nickname"
          value={userData.nickname}
          onChange={handleChange}
        />
          <p>전화번호를 입력해주세요.(-를 포함해주세요) <span className="star">*</span></p>
          <input
          type="input"
          className="register_phone"
          placeholder="000-0000-0000"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
        />
      </div>
      <BlueButton onClick={handleSignUp} content="회원가입" />
    </div>
  );
}

export default SignUp;
