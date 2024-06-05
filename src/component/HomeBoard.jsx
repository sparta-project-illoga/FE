import React, {useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { fetchBoardListSelector } from '../recoil/selectors';

function HomePost() {
  const boardListLoadable = useRecoilValueLoadable(fetchBoardListSelector);
  const setBoardList = useSetRecoilState(fetchBoardListSelector);

  useEffect(() => {
    if (boardListLoadable.state === 'loading') {
      setBoardList([]);
    }
  }, [boardListLoadable.state, setBoardList]);

  let content;
  switch (boardListLoadable.state) {
    case 'hasValue':
      content = boardListLoadable.contents.map((board) => (
        <Link to={`/post/${board.id}`} key={board.id}>
          <li>[{board.region}] {board.title}</li>
        </Link>
      ));
      break;
    case 'loading':
      content = <div>Loading...</div>;
      break;
    case 'hasError':
      content = <div>Error loading board list</div>;
      break;
    default:
      content = <div>Unknown state</div>;
  }

  return (
    <div>
      <ul>
        {content}
      </ul>
    </div>
  );
}

export default HomePost;