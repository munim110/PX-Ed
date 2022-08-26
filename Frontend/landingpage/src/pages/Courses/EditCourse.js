import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const CourseURL = 'http://127.0.0.1:8000/api/courses/'

function editCourse(data, courseID) {
    return fetch(`${CourseURL}${courseID}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

function updateThumbnail(data, courseID) {
    return fetch(`${CourseURL}${courseID}/`, {
        method: 'PUT',
        body: data
    }).then(res => res.json()).catch(err => console.log(err));
}

const EditCourse = () => {
    const { courseID } = useParams();
    const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser, myUser, authenticated } = useGlobalContext();
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
        console.log(courseID)
    }, []);

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [target_audience, setTargetAudience] = React.useState('');
    const [outcome, setOutcomes] = React.useState('');
    const [outline, setOutline] = React.useState('');
    const [image, setImage] = React.useState();
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [course, setCourse] = React.useState('');

    const [success, setSuccess] = React.useState(false);

    const [nameError, setNameError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [tagsError, setTagsError] = React.useState(false);
    const [targetAudienceError, setTargetAudienceError] = React.useState(false);
    const [outcomesError, setOutcomesError] = React.useState(false);
    const [outlineError, setOutlineError] = React.useState(false);

    const instructor = getUserName();

    useEffect(() => {
        // Fetch course
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
                setCourse(data);
                setName(data.name);
                setDescription(data.description);
                setTags(data.tags);
                setTargetAudience(data.target_audience);
                setOutcomes(data.outcome);
                setOutline(data.outline);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        setDescriptionError(false);
        setTagsError(false);
        setTargetAudienceError(false);
        setOutcomesError(false);
        setOutlineError(false);

        if (name === '' || description === '' || tags === '' || target_audience === '' || outcome === '' || outline === '') {
            if (name === '') {
                setNameError(true);
            }
            if (description === '') {
                setDescriptionError(true);
            }
            if (tags === '') {
                setTagsError(true);
            }
            if (target_audience === '') {
                setTargetAudienceError(true);
            }
            if (outcome === '') {
                setOutcomesError(true);
            }
            if (outline === '') {
                setOutlineError(true);
            }
        }
        else{
            const data = { name, description, tags, target_audience, outcome, outline, instructor };
            const response = await editCourse(data, courseID);
            console.log(response);

            // There should not be any unique Error, so handle image if necessary
            if(image != null){
                console.log(image);
                const formData = new FormData();
                formData.append('thumbnail', image, image.name);
                const response = await updateThumbnail(formData, courseID);
                console.log(response);
                setSuccess(true);
            }
            else{
                setSuccess(true);
            }
        }
    }

    let navigate = useNavigate();
    useEffect(() => {
        if (success) {
            navigate('/courses');
        }
    }, [success]);

    if(!isInstructor){
        navigate('/courses'); 
    }

    if(loading){
        return <Loading />
    }

    return (
        <>
            <div className='add-blog-div'>
                <div className='add-blog-wrapper'></div>
                <section className='add-course-block'>
                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Edit Course</h1>
                    </header>

                    <form className='add-course-form' onSubmit={handleSubmit}>
                        <div className='add-course-form-wrapper'>
                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Name</label>
                                <input className='form-input-field' type="text" id="name" placeholder="Name" defaultValue={course.name} onChange={
                                    e => setName(e.target.value)
                                } />
                                {nameError && <span className='add-blog-error-text'>Name is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Tags</label>
                                <input className='form-input-field' type="text" id="tags" placeholder="Tags, Seprarate by comma" defaultValue={course.tags} onChange={
                                    e => setTags(e.target.value)
                                } />
                                {tagsError && <span className='add-blog-error-text'>Tags is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Description</label>
                                <textarea className='content-input-field' id="description" placeholder="Description" defaultValue={course.description} onChange={
                                    e => setDescription(e.target.value)
                                } />
                                {descriptionError && <span className='add-blog-error-text'>Description is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Target Audience</label>
                                <textarea className='content-input-field' id="target_audience" placeholder="Target Audience, Seprarate by comma" defaultValue={course.target_audience} onChange={
                                    e => setTargetAudience(e.target.value)
                                } />
                                {targetAudienceError && <span className='add-blog-error-text'>Target Audience is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Outcomes</label>
                                <textarea className='content-input-field' id="outcomes" placeholder="Outcomes, Seprarate by comma" defaultValue={course.outcome} onChange={
                                    e => setOutcomes(e.target.value)
                                } />
                                {outcomesError && <span className='add-blog-error-text'>Outcomes is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Outline</label>
                                <textarea className='content-input-field' id="outline" placeholder="Outline, Seprarate by comma" defaultValue={course.outline} onChange={
                                    e => setOutline(e.target.value)
                                } />
                                {outlineError && <span className='add-blog-error-text'>Outline is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Upload Image To Update Thumbnail</label>
                                <input className='form-input-field' type="file" id="image" placeholder="Image" onChange={
                                    e => setImage(e.target.files[0])
                                } />
                            </div>


                            <div className='blog-input-wrapper'>
                                <button className='form-submit-button add-blog-button-margin' type="submit">Update</button>
                            </div>

                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}

export default EditCourse;