import React from 'react'
import { useGlobalContext } from '../context'

const BlogSearchForm = () => {
  const {setBlogSearchTerm} = useGlobalContext();
  const SearchTerm = React.useRef('');

  const searchForBlog = (e) => {
    e.preventDefault();
    setBlogSearchTerm(SearchTerm.current.value);
  }

  return (
    <section className='section search'>
      <form className='search-form'>
        <div className='form-control'>
          <label htmlFor='searchBlog'>Search For Blog</label>
          <input type='text' id='searchBlog' ref={SearchTerm} onChange={searchForBlog}></input>
        </div>
      </form>
    </section>
  )
}

export default BlogSearchForm