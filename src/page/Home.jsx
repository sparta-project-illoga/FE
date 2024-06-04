import React from "react";
import PostCard from "../component/PostCard";
import '../style/Home.css'
import PostList from "./PostList"
import PlanCarousel from "../component/PlanCarousel";

function Home() {
  return (
  <>
    <PlanCarousel />
    <div className="main">
      <div className="post_list">
        <PostList />
      </div>
    </div>
  </>
  )
}

export default Home;
