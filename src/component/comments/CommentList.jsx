import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Comment.css'
import { useCookies } from 'react-cookie';

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([])
  const [cookies] = useCookies(['Authorization']);
  const token = cookies.Authorization.replace('Bearer ', ''); 

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}/comment`)
        setComments(response.data)
      } catch (error) {
        console.error("댓글을 찾을 수 없습니다.", error)
      }
    }
    fetchCommentData()
  }, [postId])

  const fetchDelete = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/post/${postId}/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }, withCredentials: true
      })
      console.log("댓글 삭제 완료")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}/comment`);
    setComments(response.data);
    } catch (error) {
      console.error("댓글 삭제에 실패했습니다.", error)
    }
  }

  return (
    <>
    {comments.length > 0 && (
    <div className='comment_section'>
      <div className='comment_list'>
        {comments.map((comment, index) => (
          <div key={index} className='comment_detail'>
            <p>회원번호: {comment.userId}</p>
            <p>{comment.content}</p>
            <div className='comment_footer'>
              <p className='comment_date'>{comment.created_at}</p>
              <button onClick={() => fetchDelete(comment.id)}>삭제</button>
              {/* <button>수정</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
  </>
  )
}