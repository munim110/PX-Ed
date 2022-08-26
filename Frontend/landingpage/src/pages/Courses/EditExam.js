import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const examURL = 'http://127.0.0.1:8000/api/exams/'

function putExam(data, examID) {
    return fetch(`${examURL}${examID}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
}

const EditExam = () => {
    const { ExamID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [loading, setLoading] = React.useState(true);

    const [courseID, setCourseID] = React.useState('');
    const [chapterID, setChapterID] = React.useState('');

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

    // Load Exam Data
    useEffect(() => {
        const fetchExam = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${examURL}${ExamID}/`);
                const data = await response.json();
                console.log(data);
                setCourseID(data.exam_course.id);
                setChapterID(data.exam_chapter.id);
                setName(data.exam_name);
                setDuration(data.exam_duration);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchExam();
    }, [ExamID]);

    let navigate = useNavigate();
    useEffect(() => {
        if(success)
        {
            navigate('/instructorexams/' + courseID);
        }
    } , [success]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setNameError(false);
        setDurationError(false);
        setDurationNotANumber(false);

        if (name == '' || duration == '') {
            if (name == '') {
                setNameError(true);
            }
            if (duration == '') {
                setDurationError(true);
            }
        } else {
            if(!Number.isInteger(parseInt(duration))) {
                setDurationNotANumber(true);
            }
            else
            {
                const data = { exam_name: name, exam_duration: duration, chapter: chapterID, course: courseID };
                const response = await putExam(data, ExamID);
                console.log(response);
                setSuccess(true);
            }
        }
    }

    // Render page
    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="add-blog-div">

                <div className='add-blog-wrapper'></div>
                <section className='add-video-block'>

                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Edit Exam</h1>
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
                                <button className='form-submit-button add-blog-button-margin' type="submit">Edit Exam</button>
                            </div>

                        </div>

                    </form>
                </section>

            </div>
        </>
    )
}

export default EditExam;