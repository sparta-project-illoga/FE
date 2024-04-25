import React, { useState } from "react";
import "../style/login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BlueButton from "../component/BlueButton";
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['Authorization']);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
        email,
        password,
      });

      setCookie('Authorization', `Bearer ${response.data.access_token}`, { path: '/' });
      Swal.fire({
        text: `로그인이 완료되었습니다.`,
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: 'my-swal',
        },
      });
      navigate('/')
    } catch (error) {
      alert(error.response.data.message)
      console.error(error);
    }
  };

  return (
    <div className="login_container">
      <div className="login_title">
        <p>로그인하기</p>
        <p className="register_des">
          이메일과 비밀번호를 정확하게 입력해주세요.
        </p>
      </div>
      {/* <button title="새창 열림" className="sns_kakao">
        <span className="text-sm">카카오톡 아이디로 시작하기</span>
      </button>

      <button title="새창 열림" className="sns_naver">
        <span className="text-sm">네이버 아이디로 시작하기</span>
      </button>
      <p>또는</p> */}

      <div className="login_bottom">
        <div>
          <p>이메일</p>
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
            type="password"
            className="password_input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          {/* <input type="checkbox" /> <label>자동로그인</label> | */}
          <BlueButton onClick={handleLogin} content="로그인" />
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
