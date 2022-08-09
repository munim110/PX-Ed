import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
import { getUserName } from '../../Utils'

const url = 'http://127.0.0.1:8000/api/courses/'

const SingleCourse = () => {
    // Contexts and Parameters
    const { id } = useParams();
    const { setCourseSearchTerm } = useGlobalContext();
    const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [course, setCourse] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [instructor, setInstructor] = React.useState(false);

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
    }, []);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}${id}/`);
                const data = await response.json();
                setCourse(data);
                console.log(data);
                if (JSON.parse(localStorage.getItem('user'))) {
                    if (getUserName() === data.instructor) {
                        setInstructor(true);
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [id]);

    if (loading) {
        return <Loading />
    }

    return (
        <section className="section">
            {instructor && <Link to={`/addchapter/${id}`} className="btn btn-primary">Add Chapters</Link>}
            {instructor && <Link to={`/addvideotocourse/${id}`} className="btn btn-primary">Add Video</Link>}
            <img src={course.thumbnail} alt={course.title} className="blog-thumbnail" />
            <div className="blog-title">
                <h2>{course.title}</h2>
            </div>
            <div className="blog-body">
                <div className="blog-info">
                    <p>{course.description}</p>
                </div>
            </div>
        </section>
    );
}

export default SingleCourse;