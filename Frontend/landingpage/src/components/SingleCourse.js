import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Course = ({ id, name, description, instructor, thumbnail }) => {
    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/courses/${id}`;
        navigate(path);
    }

    return (
        <article className='course'>
            <Link to={`/course/${id}`}>
                <div className='img-container'>
                    <img src={thumbnail} alt={name} />
                </div>
            </Link>
            <div className='course-footer'>
                <Link to={`/course/${id}`}><h4>{name}</h4></Link>
                <h5>{instructor}</h5>
                <p>{description.substring(0, 150)}...<button className='btn-white' onClick={routeChange}>see more</button></p>
            </div>
        </article>
    );
}

export default Course;