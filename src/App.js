import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import SignUp from "./page/SignUp";
import Profile from "./page/Profile";
import Plan from "./page/plan/Plan";
import "./App.css";
import mainlogo from "./asset/illoga_logo 1.png";
import profileLogo from "./asset/account_circle.svg";
import logoutLogo from "./asset/logout.svg";
import SearchBar from "./component/SearchBar";

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
import Local from "./page/local/Local";
import LocalPost from "./page/LocalPost";
import LocalPostContent from "./page/LocalPostContent";
import LocalPostWrite from "./page/LocalPostWrite";
import PrivateRoute from "./component/PrivateRoute";
import InfinitePlan from "./page/plan/InfinitePlan";

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
        <SearchBar />
        <div className="auth_links">
          {isLoggedIn ? (
            <div className="nav_links">
              <Link
                to="/profile"
                className="profile_button"
                style={{ fontSize: "20px" }}
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
            <div className="nav_links">
              <Link to="/signup">
                {/* <img
                  src={registerLogo}
                  alt="회원가입"
                  className="regiester_button"
                /> */}
                <button className="regiester_button">회원가입</button>
              </Link>
              <Link to="/login">
                {/* <img src={loginLogo} alt="로그인" className="login_button" /> */}
                <button className="login_button">로그인</button>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className="links_section">
        <Link
          to="/plan"
          style={{
            color: "#007957",
            fontSize: "20px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          플랜 생성
        </Link>

        <Link
          to="/local"
          style={{
            color: "#007957",
            fontSize: "20px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          사이트 소개
        </Link>

        <Link
          to="/all/plan"
          style={{
            color: "#007957",
            fontSize: "20px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          전체 플랜
        </Link>

        <Link
          to="/local"
          style={{
            color: "#007957",
            fontSize: "20px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          지역 정보
        </Link>

        <Link
          to="/post"
          style={{
            color: "#007957",
            fontSize: "20px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          지역 게시판
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} key="home-link" />
        <Route path="/login" element={<Login />} key="login-link" />
        <Route path="/signup" element={<SignUp />} key="signup-link" />
        <Route path="/profile" element={<Profile />} key="profile-link" />
        <Route path="/profile/modifyprofile" element={<ModifyProfile />} />
        <Route element={<PrivateRoute />}>
          <Route path="/plan" element={<Plan />} key="plan-link" />
        </Route>
        <Route path="/local" element={<Local />} key="local-link" />
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

        <Route path="/all/plan" element={<InfinitePlan />} key="allPlan-link" />
        <Route path="/my/plan/room" element={<MyPlanNRooms />} key="my-link" />
        <Route path="/plan/:id" element={<MyPlan />} key="myPlan-link" />
        <Route path="/chat/:id" element={<Chat />} key="chat-link" />

        <Route path="/post" element={<LocalPost />} key="local-post" />
        <Route
          path="/post/:id"
          element={<LocalPostContent />}
          key="local-post-detail"
        />
        <Route
          path="/post/write"
          element={<LocalPostWrite />}
          key="local-post-write"
        />
      </Routes>
    </div>
  );
}

export default App;
