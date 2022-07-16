import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Blog = ({ id, title, author, publish_date, thumbnail, content }) => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/blog/${id}`;
    navigate(path);
  }
  return (
    <article className='blog'>
      <Link to={`/blog/${id}`}>
        <div className='img-container'>
          <img src={thumbnail} alt={title} />
        </div>
      </Link>
      <div className='blog-footer'>
        <Link to={`/blog/${id}`}><h4>{title}</h4></Link>
        <h5>{author}</h5>
        <p>{content.substring(0, 150)}...<button className='btn-white' onClick={routeChange}>see more</button></p>
      </div>
    </article>
  )
}

export default Blog
