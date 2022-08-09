import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
import { formatDate, tagArray } from '../../Utils'

const url = 'http://127.0.0.1:8000/api/blogs/'
const commentURL = 'http://127.0.0.1:8000/api/blog-comments/?search='
const addCommentUrl = 'http://127.0.0.1:8000/api/add-blog-comments/'

// POST comment
function postComment(data) {
  return fetch(addCommentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json()).catch(err => console.log(err));
}

const SingleBlog = () => {
  // Contexts and Parameters
  const { id } = useParams();
  const { setBlogSearchTerm } = useGlobalContext();
  const { authenticated, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  // State
  const [blog, setBlog] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);

  // Variables
  const tag_color = {
    color: '#777',
  }

  // Load Page
  useEffect(() => {
    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  // Fetch Blog and Comments
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}${id}/`);
        const comments = await fetch(`${commentURL}${id}`);
        const data = await response.json();
        const commentData = await comments.json();
        setBlog(data);
        if (commentData.length > 0) {
          const cs = commentData.map(c => {
            return {
              username: c.user.username,
              profile_pic: c.user.profile_pic,
              comment: c.comment
            };
          });
          setComments(cs);
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  // Functions
  // Clicking on a tag
  const searchForBlog = (tag) => {
    if (tag) {
      setBlogSearchTerm(tag.tag);
    }
  }

  // Commenting
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log(comment);
    if (comment != '') {
      const data = {
        comment: comment,
        blog: id,
        user: JSON.parse(localStorage.getItem('user')).id
      }
      postComment(data).then(res => {
        setComment('');
        window.location.reload();
      }).catch(err => console.log(err));
    }
  }

  // Render
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
      <div className='comment-section'>
        <div></div>
        <div className='comment-center-area'>
          <h1>Comments ({comments.length})</h1>
          {authenticated && <div className='add-comment-section'>
            <p className='add-comment-text'>Add a comment</p>
            <form className='add-comment-form' onSubmit={handleCommentSubmit}>
              <textarea className='comment-textarea' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
              <button className='comment-button' type='submit'>Add Comment</button>
            </form>
          </div>
          }
          {comments.map(c => {
            return <div className='comment-container' key={c.username}>
              <div className='comment-profile-pic'>
                <img src={c.profile_pic} alt={c.username} className='comment-profile-pic' />
              </div>
              <div className='comment-text-section'>
                <div className='comment-user-name'>{c.username}</div>
                <div className='comment-comment-text'>{c.comment}</div>
              </div>
            </div>
          })}
        </div>
      </div>
    </section>
  )
}

export default SingleBlog
