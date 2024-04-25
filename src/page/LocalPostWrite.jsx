import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../style/localPostWrite.css'
import { useNavigate } from 'react-router-dom';

const LocalPostWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cookies] = useCookies('Authorization');
  const navigate = useNavigate();


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = cookies.Authorization.replace('Bearer ', ''); 
      await axios.post(`${process.env.REACT_APP_API_URL}/post`, {
        title: title,
        content: content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }, withCredentials: true
      });
      navigate('/post');
    } catch (error) {
      console.log('게시글 생성 실패', error)
    }
    console.log(`Title: ${title}, Content: ${content}`);
  };

  return (
    <div className='post_write'>
      <div className='post_write_header'>
      <p>글쓰기</p>
      <p>지역홍보, 여행지 소개 등의 내용으로 게시글을 작성해주세요.</p>
      </div>
      <label>
        Title:
        <input type="text" value={title} onChange={handleTitleChange} />
      </label>
        <textarea value={content} onChange={handleContentChange}></textarea>
      <button onClick={handleSubmit}>Create Post</button>
    </div>
  );
};

export default LocalPostWrite;
