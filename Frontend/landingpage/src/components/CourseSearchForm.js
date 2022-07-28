import React from 'react'
import { useGlobalContext } from '../context'

const BlogSearchForm = () => {
    const { setCourseSearchTerm } = useGlobalContext();
    const SearchTerm = React.useRef('');

    const searchForBlog = (e) => {
        e.preventDefault();
        setCourseSearchTerm(SearchTerm.current.value);
    }

    return (
        <section className='section search'>
            <form className='search-form'>
                <div className='form-control'>
                    <label htmlFor='searchBlog'>Search For Course</label>
                    <input type='text' id='searchBlog' ref={SearchTerm} onChange={searchForBlog}></input>
                </div>
            </form>
        </section>
    )
}

export default BlogSearchForm