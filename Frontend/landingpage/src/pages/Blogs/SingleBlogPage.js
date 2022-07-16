import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
const url = 'http://127.0.0.1:8000/api/blogs/'

const formatDate = (date) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const d = new Date(date);
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const tagArray = (tags) => {
  if (tags) {
    const tagArray = tags.split(',');
    return tagArray;
  }
}

const SingleBlog = () => {
  const { id } = useParams();
  const { setBlogSearchTerm } = useGlobalContext();
  const { useNavbar, setUseNavbar } = useGlobalContext();
  setUseNavbar(true)

  const searchForBlog = (tag) => {
    if (tag) {
      setBlogSearchTerm(tag.tag);
    }
  }

  const tag_color = {
    color: '#777',
  }

  const [blog, setBlog] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}${id}/`);
        const data = await response.json();
        setBlog(data);
        console.log(data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return <Loading />
  }
  return (
    <section className='section'>
      <img src={blog.thumbnail} alt={blog.title} className='blog-thumbnail' />
      <div className='blog-title'>
        <h2>{blog.title}</h2>
      </div>
      <div className='blog-body'>
        <div className='blog-info'>
          <span className='blog-writer'>{blog.author}</span>
          <span className='blog-date'>{formatDate(blog.publish_date)}</span>
          <span className='blog-tags'>
            {blog.tags && tagArray(blog.tags).map(tag => {
              return <Link to={`/blogs/`} key={tag} onClick={() => searchForBlog({ tag })} style={tag_color}>#{tag} </Link>
            })}
          </span>
        </div>
        <div className='blog-content'>
          {blog.content}
        </div>
      </div>
    </section>
  )
}

export default SingleBlog
