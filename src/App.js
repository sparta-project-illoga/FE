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
<<<<<<< HEAD
          <Link to="/plan" style={{ color: "purple", fontSize: "20px" }}>
            Plan 생성
=======
          <Link
            to="/profile"
            className="profile_button"
            style={{ color: "black", fontSize: "20px" }}
          >
            | profile
>>>>>>> 71d1d0e976849faf571ad1dd6de847a7dfc76b29
          </Link>{" "}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} key="home-link" />
        <Route path="/login" element={<Login />} key="login-link" />
        <Route path="/signup" element={<SignUp />} key="signup-link" />
        <Route path="/profile" element={<Profile />} key="profile-link" />
<<<<<<< HEAD
        <Route path="/plan/*" element={<Plan />} key="plan-link" />
=======
        <Route path="/profile/modifyprofile" element={<ModifyProfile />} />
>>>>>>> 71d1d0e976849faf571ad1dd6de847a7dfc76b29
      </Routes>
    </div>
  );
}

export default App;
