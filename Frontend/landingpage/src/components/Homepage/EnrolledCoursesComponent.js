import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const EnrolledCourse = ({ id, name, thumbnail }) => {
    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/courses/${id}`;
        navigate(path);
    }

    if (name.length > 20) {
        return (
            <article className='enrolled-course'>
                <Link to={`/course/${id}`}>
                    <div className='img-container'>
                        <img src={thumbnail} alt={name} />
                    </div>
                </Link>
                <div className='enrolled-course-footer'>
                    <Link to={`/course/${id}`}><h4>{name.substring(0, 20)}...</h4></Link>
                </div>
            </article>
        );
    }
    else {
        return (
            <article className='enrolled-course'>
                <Link to={`/course/${id}`}>
                    <div className='img-container'>
                        <img src={thumbnail} alt={name} />
                    </div>
                </Link>
                <div className='enrolled-course-footer'>
                    <Link to={`/course/${id}`}><h4>{name}</h4></Link>
                </div>
            </article>
        );
    }
}

export default EnrolledCourse;