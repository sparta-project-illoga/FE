import React, { useState } from "react";
import "../style/login.css";

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BlueButton from "../component/BlueButton";
import { useCookies } from 'react-cookie';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['Authorization']);

  const handleLogin = async () => {
    try {
      console.log("handleLogin 실행됨");
      console.log("email : ", email);
      console.log("password : ", password);
      const response = await axios.post('http://localhost:3000/user/login', {
        email,
        password,
      });

<<<<<<< HEAD
      console.log("login - response : ", response);
      console.log(response.data); // 응답 데이터 확인 예시
=======
      setCookie('Authorization', `Bearer ${response.data.access_token}`, { path: '/' });
>>>>>>> 71d1d0e976849faf571ad1dd6de847a7dfc76b29
      navigate('/')
    } catch (error) {
      console.error(error); // 에러 처리 예시
    }
  };

  return (
    <div className="login_container">
      <div className="login_title">
        <p>로그인하기</p>
      </div>
      <button title="새창 열림" className="sns_kakao">
        <span className="text-sm">카카오톡 아이디로 시작하기</span>
      </button>

      <button title="새창 열림" className="sns_naver">
        <span className="text-sm">네이버 아이디로 시작하기</span>
      </button>
      <p>또는</p>

      <div className="login_bottom">
        <div>
          <p>아이디</p>
          <input
            type="input"
            className="id_input"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p>비밀번호</p>
          <input
            type="input"
            className="password_input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          {/* <input type="checkbox" /> <label>자동로그인</label> | */}
          {/* <BlueButton onClick={handleLogin} content="로그인" /> */}
          <button onClick={handleLogin}>로그인</button>
        </div>

        <div className="ask_signUp">
          <p>
            아이디가 없으신가요?<span>회원가입</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
