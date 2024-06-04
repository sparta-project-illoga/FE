import React from 'react'
import "./SearchBar.css"

function SearchBar() {
  return (
    <div>
      <div className="main_search">
        <input type="text" placeholder="키워드 입력" />
        <button>검색</button>
      </div>
    </div>
  )
}

export default SearchBar