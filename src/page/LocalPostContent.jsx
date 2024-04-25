import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Comment from '../component/comments/Comment'
import '../style/localPostContent.css'

function LocalPostContent() {
  const [post, setPost] = useState(null)
  const {id = ''} = useParams()

// post 내용 패칭
  useEffect(() => {
    const fetchPostData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/${id}`)
      setPost(response.data)
    } catch (error) {
      console.log("게시물을 찾을 수 없습니다.")
    }
  }
    fetchPostData()
  }, [id])
  
    if (!post) { // post 데이터가 없는 경우
      return <div>Loading...</div>
    }

  return (
    <div>
      <div className='post_detail'>
        <div className='post_header'>
        <p>{post.region}</p>
        <p>{post.title}</p>
        <p>{post.user_nickname}</p>
        </div>

        <div className='post_content'>
          {post.content}
        </div>
      </div>
      <Comment postId={id}/>
    </div>
  )
}

export default LocalPostContent