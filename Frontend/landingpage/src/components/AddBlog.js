import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const addBlog = () => {
    return (
        <section className='add-blog-section'>
            <Link to='/addblog'>
                <button className='btn'>Add Blog</button>
            </Link>
        </section>
    );
}

export default addBlog