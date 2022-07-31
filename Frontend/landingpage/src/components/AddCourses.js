import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const addCourse = () => {
    return (
        <section className='add-blog-section'>
            <Link to='/addcourse'>
                <button className='btn'>Add Course</button>
            </Link>
        </section>
    );
}

export default addCourse