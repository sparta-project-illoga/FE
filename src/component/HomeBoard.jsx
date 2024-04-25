import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';

function HomePost() {
  const [boardList, setBoardList] = useState([])

  useEffect(() => {
    try{
    axios.get('http://localhost:3000/post')
    .then((response) => {
      setBoardList([...response.data].reverse().slice(0, 5))
    })

  } catch(error) {
      console.log(error)
    }
  }, [])

  return (
    <div>
      <ul>
      {boardList.map((board, index) => (
      <Link to={`/post/${board.id}`}>
      <li key={index}>[{board.region}] {board.title}</li>
      </Link>
    ))}
    </ul>
    </div>
  )
}

export default HomePost