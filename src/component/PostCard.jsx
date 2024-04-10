import React from 'react'
import logoImg from "../logo.svg"
import LikeButton from './Likebutton'
import './PostCard.css'

function PostCard(props) {
  return (
    <div className='post_card'>
        <img src={props.img} alt="썸네일1" className='post_thumbnail'/>

        <div className='post_footer'>
            <div className='footer_contents'>
                <p>{props.title}</p>
                <p>{props.author}</p>
            </div>
            <LikeButton />
        </div>
    </div>
  )
}

export default PostCard