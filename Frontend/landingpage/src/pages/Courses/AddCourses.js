import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { Link, useNavigate } from 'react-router-dom'

function getUserName() {
    let data = localStorage.getItem('user');
    if (data != null) {
        data = JSON.parse(data);
        return data.username;
    }
    return '';
}

function addCourse(data) {
    console.log(JSON.stringify(data));
    return fetch('http://127.0.0.1:8000/api/add_courses/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error));
}


function putThumbnail(id, image) {
    return fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {
        method: 'PUT',
        body: image,
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}

const AddCourses = () => {
    const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser, myUser, authenticated } = useGlobalContext();
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
    }, []);



    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [target_audience, setTargetAudience] = React.useState('');
    const [outcome, setOutcomes] = React.useState('');
    const [outline, setOutline] = React.useState('');
    const [image, setImage] = React.useState();
    const instructor = getUserName();


    const [success, setSuccess] = React.useState(false);

    const [nameError, setNameError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [tagsError, setTagsError] = React.useState(false);
    const [targetAudienceError, setTargetAudienceError] = React.useState(false);
    const [outcomesError, setOutcomesError] = React.useState(false);
    const [outlineError, setOutlineError] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [uniqueError, setUniqueError] = React.useState(false);

    const publishDate = new Date().toISOString().slice(0, 10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        setDescriptionError(false);
        setTagsError(false);
        setTargetAudienceError(false);
        setOutcomesError(false);
        setOutlineError(false);
        setUniqueError(false);

        if (name === '' || description === '' || tags === '' || target_audience === '' || outcome === '' || outline === '' || image === '') {
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
            if (image === '') {
                setImageError(true);
            }
        }
        else {
            const data = await addCourse({ name, description, tags, target_audience, outcome, instructor, outline });
            console.log(data)
            if (data.non_field_errors != null) {
                console.log('Failure');
                setUniqueError(true);
            }
            else {
                // Handle image upload
                let id = data.id;
                const formData = new FormData();
                formData.append('thumbnail', image, image.name);
                let uploadData = await putThumbnail(id, formData);
                
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

    if(!specialUser || !authenticated) {
        navigate('/courses'); 
    }

    return (
        <>
            <div className='add-blog-div'>
                <div className='add-blog-wrapper'></div>
                <section className='add-blog-block'>
                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Add New Course</h1>
                    </header>

                    <form className='add-course-form' onSubmit={handleSubmit}>
                        <div className='add-course-form-wrapper'>
                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Name</label>
                                <input className='form-input-field' type="text" id="name" placeholder="Name" onChange={
                                    e => setName(e.target.value)
                                } />
                                {nameError && <span className='add-blog-error-text'>Name is required</span>}
                                {uniqueError && <span className='add-blog-error-text'>Course already exists for the instructor</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Tags</label>
                                <input className='form-input-field' type="text" id="tags" placeholder="Tags, Seprarate by comma" onChange={
                                    e => setTags(e.target.value)
                                } />
                                {tagsError && <span className='add-blog-error-text'>Tags is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Description</label>
                                <textarea className='form-input-field' id="description" placeholder="Description" onChange={
                                    e => setDescription(e.target.value)
                                } />
                                {descriptionError && <span className='add-blog-error-text'>Description is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Target Audience</label>
                                <textarea className='form-input-field' id="target_audience" placeholder="Target Audience" onChange={
                                    e => setTargetAudience(e.target.value)
                                } />
                                {targetAudienceError && <span className='add-blog-error-text'>Target Audience is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Outcomes</label>
                                <textarea className='form-input-field' id="outcomes" placeholder="Outcomes" onChange={
                                    e => setOutcomes(e.target.value)
                                } />
                                {outcomesError && <span className='add-blog-error-text'>Outcomes is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Outline</label>
                                <textarea className='content-input-field' id="outline" placeholder="Outline" onChange={
                                    e => setOutline(e.target.value)
                                } />
                                {outlineError && <span className='add-blog-error-text'>Outline is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Thumbnail</label>
                                <input className='form-input-field' type="file" id="image" placeholder="Image" onChange={
                                    e => setImage(e.target.files[0])
                                } />
                                {imageError && <span className='add-blog-error-text'>Thumbnail is required</span>}
                            </div>


                            <div className='blog-input-wrapper'>
                                <button className='form-submit-button add-blog-button-margin' type="submit">Publish</button>
                            </div>

                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}

export default AddCourses;

