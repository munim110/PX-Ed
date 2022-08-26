import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const addExamURL = 'http://127.0.0.1:8000/api/add-exam/'

// Function to add exam to chapter
function postExamToChapter(data) {
    return fetch(addExamURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

const AddExam = () => {
    // Contexts and Parameters
    const { courseID, chapterID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [name, setName] = React.useState('');
    const [duration, setDuration] = React.useState('');

    const [nameError, setNameError] = React.useState(false);
    const [durationError, setDurationError] = React.useState(false);
    const [durationNotANumber, setDurationNotANumber] = React.useState(false);

    const [success, setSuccess] = React.useState(false);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    // Load course
    useEffect(() => {
        // Fetch course info
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CourseURL}${courseID}/`);
                const data = await response.json();
                console.log(data);
                if (JSON.parse(localStorage.getItem('user'))) {
                    if (getUserName() === data.instructor) {
                        setIsInstructor(true);
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseID]);

    // Navigator
    const navigate = useNavigate();

    // Functions
    const NotANumber = (value) => {
        return isNaN(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        setDurationError(false);
        setDurationNotANumber(false);

        if (name === '' || duration === '') {
            if (name === '') {
                setNameError(true);
            }
            if (duration === '') {
                setDurationError(true);
            }
        }
        else {
            if (NotANumber(duration)) {
                setDurationNotANumber(true);
            }
            else {
                const data = { 'exam_name': name, 'exam_duration': duration, 'chapter': chapterID, 'course': courseID };
                const response = await postExamToChapter(data);
                console.log(response);
                setSuccess(true);
            }
        }
    }

    // Success
    useEffect(() => {
        if (success) {
            navigate(`/addexamtocourse/${courseID}`);
        }
    }, [success]);

    // Render page
    if (loading) {
        return <Loading />
    }

    if (!isInstructor) {
        navigate(`/courses/${courseID}`);
    }

    return (
        <>
            <div className="add-blog-div">

                <div className='add-blog-wrapper'></div>
                <section className='add-video-block'>

                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Add Exam to Chapter</h1>
                    </header>

                    <form className='add-course-form' onSubmit={handleSubmit}>

                        <div className='add-course-form-wrapper'>

                            <div className='blog-input-wrapper'>
                                <label className='blog-input-label'>Exam Name</label>
                                <input className='form-input-field' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                {nameError && <span className='add-blog-error-text'>Please enter a name for the exam</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='blog-input-label'>Exam Duration</label>
                                <input className='form-input-field' type='text' value={duration} onChange={(e) => setDuration(e.target.value)} />
                                {durationError && <p className='blog-input-error'>Please enter a duration for the exam</p>}
                                {durationNotANumber && <span className='add-blog-error-text'>Please enter a number for the duration</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <button className='form-submit-button add-blog-button-margin' type="submit">Add Exam</button>
                            </div>

                        </div>

                    </form>
                </section>

            </div>
        </>
    )
}

export default AddExam