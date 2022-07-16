import React from 'react'
import Blog from './SingleBlog'
import Loading from './Loading'
import { useGlobalContext } from '../context'
import { useEffect } from 'react';

const blog_url = 'http://127.0.0.1:8000/api/blogs/?search='

const BlogList = () => {
  const { blogs, setBlogs, loading, setLoading, blogSearchTerm } = useGlobalContext();
  console.log(blogSearchTerm);
  const fetchBlogs = async () => {
    setLoading(true);
    try{
      const response = await fetch(`${blog_url}${blogSearchTerm}`);
      const data = await response.json();
      if(data.length > 0){
        console.log(data);
        const blogs = data.map(blog => {
          return {
            id: blog.id,
            title: blog.title,
            author : blog.author,
            publish_date : blog.publish_date,
            thumbnail : blog.thumbnail,
            content : blog.content,
          };
        });
        setBlogs(blogs);
      }else{
        setBlogs([]);
      }
      setLoading(false);
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, [blogSearchTerm]);

  if(loading) {
    return <Loading />
  }
  if(!blogs.length) {
    return (
      <h2 className='section-title'>
        No blogs found for your keyword
      </h2>
    );
  }
  return (
    <section className='section'>
      <h2 className='section-title'>Blogs</h2>
      <div className='blog-center'>
        {blogs.map(blog => {
          return <Blog key={blog.id} {...blog} />
        })}
      </div>
    </section>
  )
}

export default BlogList
