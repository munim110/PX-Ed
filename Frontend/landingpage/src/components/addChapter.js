import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const addChapter = () => {
    return (
        <section className='add-blog-section'>
            <Link to='/addchapter'>
                <button className='btn'>Add Chapter</button>
            </Link>
        </section>
    );
}

export default addChapter