import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import "../style/localPost.css"

import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { boardListState, currentPostState, pageState } from '../recoil/atoms';
import { fetchBoardListSelector } from '../recoil/selectors';

const LocalPost = () => {
  const [boardList, setBoardList] = useRecoilState(boardListState);
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const [page, setPage] = useRecoilState(pageState);
  const boardListLoadable = useRecoilValueLoadable(fetchBoardListSelector);

  const postPerPage = 5;
  const indexOfLastPost = page * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (boardListLoadable.state === 'hasValue') {
      setBoardList(boardListLoadable.contents);
      setCurrentPost(boardListLoadable.contents.slice(indexOfFirstPost, indexOfLastPost));
    }
  }, [boardListLoadable.state, boardListLoadable.contents, indexOfFirstPost, indexOfLastPost, setBoardList, setCurrentPost]);

  useEffect(() => {
    setCurrentPost(boardList.slice(indexOfFirstPost, indexOfLastPost));
  }, [boardList, page, indexOfFirstPost, indexOfLastPost, setCurrentPost]);

  let content;
  switch (boardListLoadable.state) {
    case 'hasValue':
      content = (
        <tbody>
          {currentPost.map((board, index) => {
            const dateString = board.created_at;
            const date = dateString.substring(0, 10);

            return (
              <tr key={index}>
                <td className="centered">{indexOfFirstPost + index + 1}</td>
                <td className="centered">{board.region}</td>
                <td className="title-centered">
                  <Link to={`/post/${board.id}`}>{board.title}</Link>
                </td>
                <td className="centered">{date}</td>
              </tr>
            );
          })}
        </tbody>
      );
      break;
    case 'loading':
      content = <tbody><tr><td colSpan="4">Loading...</td></tr></tbody>;
      break;
    case 'hasError':
      content = <tbody><tr><td colSpan="4">Error loading board list</td></tr></tbody>;
      break;
    default:
      content = <tbody><tr><td colSpan="4">Unknown state</td></tr></tbody>;
  }

  return (
    <div className="board_list">
      <h4>Total post : {boardList.length}</h4>

      <table className="post_table">
        <colgroup>
          <col width="15%" />
          <col width="10%" />
          <col width="65%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th>No</th>
            <th>region</th>
            <th>title</th>
            <th>Date</th>
          </tr>
        </thead>

        {content}
      </table>

      {boardListLoadable.state === 'hasValue' && (
        <Pagination
          activePage={page}
          itemsCountPerPage={postPerPage}
          totalItemsCount={boardList.length}
          pageRangeDisplayed={5}
          prevPageText={"<"}
          nextPageText={">"}
          onChange={handlePageChange}
        />
      )}

      <Link to="/post/write">
        <button>Write</button>
      </Link>
    </div>
  );
};

export default LocalPost;