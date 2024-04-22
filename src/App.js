import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import SignUp from "./page/SignUp";
import Profile from "./page/Profile";
import Plan from "./page/plan/Plan";
import "./App.css";
import mainlogo from "./asset/illoga_logo.jpg";
import loginLogo from "./asset/login.svg";
import registerLogo from "./asset/app_registration.svg";
import profileLogo from "./asset/account_circle.svg";
import logoutLogo from "./asset/logout.svg";

import ModifyProfile from "./page/ModifyProfile";
import Activeness from "./page/plan/Activeness";
import Passivity from "./page/plan/Passivity";
import Schedule from "./page/schedule/Schedule";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Chat from "./page/chat/Chat";
import MyPlanNRooms from "./page/MyPlanNRooms";
import MyPlan from "./page/plan/MyPlan";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["Authorization"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.Authorization;
    setIsLoggedIn(!!token);
    setLoading(false); // 로딩 완료
  }, [cookies.Authorization]);

  if (loading) {
    return <div>로딩 중입니다...</div>; // 로딩 컴포넌트 또는 메시지 표시
  }

  const logout = () => {
    removeCookie("Authorization"); // 쿠키를 삭제
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <div className="App">
      <nav className="main_nav">
        <div className="logo_section">
          <Link to="/" className="home_button">
            <img src={mainlogo} alt="메인로고" className="main_logo" />
          </Link>
        </div>
        <div className="links_section">
          <Link
            to="/plan"
            style={{ color: "white", fontSize: "35px", textDecoration: "none" }}
          >
            플랜 생성
          </Link>

          <Link
            to="/plan"
            style={{ color: "white", fontSize: "35px", textDecoration: "none" }}
          >
            지역 정보
          </Link>

          <Link
            to="/plan"
            style={{ color: "white", fontSize: "35px", textDecoration: "none" }}
          >
            지역 게시판
          </Link>
        </div>
        <div className="auth_links">
          {isLoggedIn ? (
            <div className="nav_links">
              <Link
                to="/profile"
                className="profile_button"
                style={{ color: "white", fontSize: "20px" }}
              >
                <img src={profileLogo} alt="프로필" className="profile_logo" />
              </Link>
              <img
                src={logoutLogo}
                onClick={logout}
                alt="로그아웃"
                className="logout_button"
              />
            </div>
          ) : (
            <div class="nav_links">
              <Link to="/signup" style={{ color: "white", fontSize: "20px" }}>
                <img
                  src={registerLogo}
                  alt="회원가입"
                  className="regiester_button"
                />
              </Link>
              <Link
                to="/login"
                className="login_button"
                style={{ color: "white", fontSize: "20px" }}
              >
                <img src={loginLogo} alt="로그인" className="login_button" />
              </Link>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} key="home-link" />
        <Route path="/login" element={<Login />} key="login-link" />
        <Route path="/signup" element={<SignUp />} key="signup-link" />
        <Route path="/profile" element={<Profile />} key="profile-link" />
        <Route path="/profile/modifyprofile" element={<ModifyProfile />} />
        <Route path="/plan" element={<Plan />} key="plan-link" />
        <Route
          path="/plan/activeness/:id"
          element={<Activeness />}
          key="activeness-link"
        />
        <Route
          path="/plan/passivity/:id"
          element={<Passivity />}
          key="passivity-link"
        />
        <Route
          path="/plan/:id/schedule"
          element={<Schedule />}
          key="schedule-link"
        />

        <Route path="/my/plan/room" element={<MyPlanNRooms />} key="my-link" />
        <Route path="/plan/:id" element={<MyPlan />} key="myPlan-link" />
        <Route path="/chat/:id" element={<Chat />} key="chat-link" />
      </Routes>
    </div>
  );
}

export default App;
