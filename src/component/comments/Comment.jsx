import React from 'react'
import './Comment.css'
import { useState } from 'react';
import CommentList from './CommentList';
import { useCookies } from 'react-cookie';
import axios from 'axios'

export default function Comment( { postId } ) {
  const [newComment, setNewComment] = useState('');
  const [cookies] = useCookies(['Authorization']);
  console.log(newComment)

// 댓글 작성 패칭
const commentSubmit = async () => {
  try {
    await axios.post(`http://localhost:3000/post/${postId}/comment`, { content: newComment }, {
    headers: {
      Authorization: cookies.Authorization
    }, withCredentials: true
  });
  setNewComment('');
  window.location.reload();
  console.log('댓글 작성 완료')
  } catch (error) {
    console.error('댓글 생성 실패', error);
  }
}

  return (
    <>
      <CommentList postId={postId} />

      <div className='comment_write'>
        <input type="text" 
        className='comment_input' 
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요"/>
        <button onClick={commentSubmit}>댓글 작성</button>
      </div>
    </>
  )
}