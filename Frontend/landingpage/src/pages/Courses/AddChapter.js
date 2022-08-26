import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const CourseURL = 'http://127.0.0.1:8000/api/courses/'
const addChapterURL = 'http://127.0.0.1:8000/api/add_chapters/'

// Function to post new chapter to database
function addChapter(data){
    return fetch(addChapterURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

const AddChapter = () => {
    // Contexts and Parameters
    const { id } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [outcome, setOutcome] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [outcomeError, setOutcomeError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
    }, []);

    // Load course
    useEffect(() => {
        // Fetch course info
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CourseURL}${id}/`);
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
    }, [id]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        setDescriptionError(false);
        setOutcomeError(false);

        if (name == '' || description == '' || outcome == '') {
            if (name == '') {
                setNameError(true);
            }
            if (description == '') {
                setDescriptionError(true);
            }
            if (outcome == '') {
                setOutcomeError(true);
            }
        }
        else {
            const data = await addChapter({ 'name' : name, 'description' : description, 'outcome' : outcome, 'course' : id });
            console.log(data);
            setSuccess(true);
        }
    }

    // Navigator
    let navigate = useNavigate();
    useEffect(() => {
        if (success) {
            navigate('/course/' + id);
        }
    } , [success]);

    // Render page
    if (loading) {
        return <Loading />
    }

    if (!isInstructor) {
        navigate(`/courses/${id}`);
    }

    return (
        <>
            <div className='add-blog-div'>
                <div className='add-blog-wrapper'></div>
                <section className='add-chapter-block'>
                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Add New Chapter to Course</h1>
                    </header>

                    <form className='add-course-form' onSubmit={handleSubmit}>
                        <div className='add-course-form-wrapper'>
                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Name</label>
                                <input className='form-input-field' type="text" id="name" placeholder="Name" onChange={
                                    e => setName(e.target.value)
                                } />
                                {nameError && <span className='add-blog-error-text'>Name is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Description</label>
                                <input className='content-input-field' type="text" id="description" placeholder="Description" onChange={
                                    e => setDescription(e.target.value)
                                } />
                                {descriptionError && <span className='add-blog-error-text'>Description is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Outcome</label>
                                <input className='content-input-field' type="text" id="outcome" placeholder="Outcome" onChange={
                                    e => setOutcome(e.target.value)
                                } />
                                {outcomeError && <span className='add-blog-error-text'>Outcome is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <button className='form-submit-button add-blog-button-margin' type="submit">Add Chapter</button>
                            </div>

                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}

export default AddChapter;