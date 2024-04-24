import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import "../style/localPost.css"

const LocalPost = () => {
  const [boardList, setBoardList] = useState([])
  const [currentPost, setCurrentPost] = useState(boardList)
  const [page, setPage] = useState(1) // 현재 페이지 번호

  const postPerPage = 5
  const indexOfLastPost = page*postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage

  const boardLength = boardList.length

  const handlePageChange = (page) => {
    setPage(page)
  }

  useEffect(() => {
    try{
    axios.get('http://localhost:3000/post')
    .then((response) => {
      setBoardList([...response.data].reverse())
    })

  } catch(error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    setCurrentPost(boardList.slice(indexOfFirstPost, indexOfLastPost))
  }, [boardList, page])

  return (
    <div className="board_list">
      <h4>Total post : {boardLength}</h4>

      <table className="post_table">
        <colgroup>
          <col width="15%"/>
          <col width="10%"/>
          <col width="65%"/>
          <col width="10%"/>
        </colgroup>

        <thead>
          <tr>
            <th>No</th>
            <th>region</th>
            <th>title</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {
            currentPost.map((board, index) => {
              const dateString = board.created_at;
              const date = dateString.substring(0, 10);

              return (
                <tr key={index}>
                  <td className="centered">{index + 1}</td>
                  <td className="centered">{board.region}</td>
                  <td><Link to={`/post/${board.id}`}>{board.title}</Link></td>
                  <td className="centered">{date}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <Pagination
      activePage={page}
      itemsCountPerPage={postPerPage}
      totalItemsCount={boardList.length}
      pageRangeDisplayed={5}
      prevPageText={"<"}
      nextPageText={">"}
      onChange={handlePageChange}/>

      <Link to="/post/write">
      <button>글쓰기</button>
      </Link>
    </div>
  )
}

export default LocalPost