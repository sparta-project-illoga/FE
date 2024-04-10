import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import SignUp from "./page/SignUp";
import Profile from "./page/Profile";
import "./App.css";
import mainlogo from "./asset/career com.jpg";

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
          <Link to="/signup" style={{ color: "white", fontSize: "20px" }}>
            SignUp
          </Link>{" "}
          <Link
            to="/login"
            className="login_button"
            style={{ color: "white", fontSize: "20px" }}
          >
            | Login
          </Link>{" "}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} key="home-link" />
        <Route path="/login" element={<Login />} key="login-link" />
        <Route path="/signup" element={<SignUp />} key="signup-link" />
        <Route path="/profile" element={<Profile />} key="profile-link" />
      </Routes>
    </div>
  );
}

export default App;
