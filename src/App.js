import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import SignUp from "./page/SignUp";
import Profile from "./page/Profile";
import Plan from "./page/plan/Plan";
import "./App.css";
import mainlogo from "./asset/illoga_logo.jpg";
import ModifyProfile from "./page/ModifyProfile";
import Activeness from "./page/plan/Activeness";
import Passivity from "./page/plan/Passivity";
import Schedule from "./page/schedule/Schedule";
import Chat from "./page/chat/Chat";
import MyPlanNRooms from "./page/MyPlanNRooms";
import MyPlan from "./page/plan/MyPlan";

function App() {
  return (
    <div className="App">
      <nav className="main_nav">
        <Link to="/" className="home_button">
          <img src={mainlogo} alt="메인로고" className="main_logo" />
        </Link>
        <div>
          {/* <Link to="/profile" style={{ color: "navy", fontSize: "20px" }}>
            Profile
          </Link>{" "} */}
          <Link to="/signup" style={{ color: "black", fontSize: "20px" }}>
            SignUp
          </Link>{" "}
          <Link
            to="/login"
            className="login_button"
            style={{ color: "black", fontSize: "20px" }}
          >
            | Login
          </Link>{" "}
          <Link to="/plan" style={{ color: "purple", fontSize: "20px" }}>
            Plan 생성
          </Link>
          <Link
            to="/profile"
            className="profile_button"
            style={{ color: "black", fontSize: "20px" }}
          >
            | profile
          </Link>{" "}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} key="home-link" />
        <Route path="/login" element={<Login />} key="login-link" />
        <Route path="/signup" element={<SignUp />} key="signup-link" />
        <Route path="/profile" element={<Profile />} key="profile-link" />
        <Route path="/profile/modifyprofile" element={<ModifyProfile />} />
        <Route path="/plan" element={<Plan />} key="plan-link" />
        <Route path="/plan/activeness/:id" element={<Activeness />} key="activeness-link" />
        <Route path="/plan/passivity/:id" element={<Passivity />} key="passivity-link" />
        <Route path="/plan/:id/schedule" element={<Schedule />} key="schedule-link" />

        <Route path="/my/plan/room" element={<MyPlanNRooms />} key="my-link" />
        <Route path="/plan/:planId" element={<MyPlan />} key="myPlan-link" />
        <Route path="/chat/:roomId" element={<Chat />} key="chat-link" />
      </Routes>
    </div>
  );
}

export default App;
