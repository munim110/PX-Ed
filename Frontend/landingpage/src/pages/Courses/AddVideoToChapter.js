import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const addVideoURL = 'http://127.0.0.1:8000/api/add_videos/'
const videoURL = 'http://127.0.0.1:8000/api/videos/'
const CourseURL = 'http://127.0.0.1:8000/api/courses/';

// First add chapter, description to database
function addVideoDetails(data) {
    return fetch(addVideoURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

// Then put video
function putVideo(id, video){
    return fetch(`${videoURL}${id}/`, {
        method: 'PUT',
        body: video
    }).then(res => res.json()).catch(err => console.log(err));
}

const AddVideo = () => {
    // Contexts and Parameters
    const { courseID, chapterID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [description, setDescription] = React.useState('');
    const [video, setVideo] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [videoError, setVideoError] = React.useState(false);
    const [notAVideo, setNotAVideo] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
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
    const isVideo = (file) => {
        const ext = file.type;
        console.log(ext);
        return ext.split('/')[0] === 'video';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDescriptionError(false);
        setVideoError(false);
        setNotAVideo(false);

        if (description == '' || video == '') {
            if (description == '') {
                setDescriptionError(true);
            }
            if (video == '') {
                setVideoError(true);
            }
        }
        else {
            if (!isVideo(video)) {
                setNotAVideo(true);
            }
            else {
                console.log(description, video);
                const data = await addVideoDetails({ 'description' : description, 'chapter' : chapterID });
                console.log(data);

                // Assuming success
                // Handle video upload
                const formData = new FormData();
                formData.append('video', video, video.name);
                const response = await putVideo(data.id, formData);
                console.log(response);
                setSuccess(true);
            }
        }
    }

    // Success
    useEffect(() => {
        if (success) {
            navigate(`/courses/${courseID}`);
        }
    } , [success]);

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
                        <h1 className='add-blog-header-text'>Add New Video to Chapter</h1>
                    </header>

                    <form className='add-course-form' onSubmit={handleSubmit}>
                        <div className='add-course-form-wrapper'>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Description</label>
                                <input className='content-input-field' type="text" id="description" placeholder="Description" onChange={
                                    e => setDescription(e.target.value)
                                } />
                                {descriptionError && <span className='add-blog-error-text'>Description is required</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Video</label>
                                <input className='form-input-field' type="file" id="image" placeholder="Image" onChange={
                                    e => setVideo(e.target.files[0])
                                } />
                                {videoError && <span className='add-blog-error-text'>Video is required</span>}
                                {notAVideo && <span className='add-blog-error-text'>File must be a video</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <button className='form-submit-button add-blog-button-margin' type="submit">Add Video</button>
                            </div>

                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}

export default AddVideo;