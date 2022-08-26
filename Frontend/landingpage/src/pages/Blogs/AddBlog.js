import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { Link, useNavigate } from 'react-router-dom'
import { getUserName } from '../../Utils'

function addBlog(data) {
    return fetch('http://127.0.0.1:8000/api/add-blog/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error));
}

function putThumbnail(id, image) {
    return fetch(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        method: 'PUT',
        body: image,
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}

const AddBlog = () => {
    const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser, myUser, authenticated } = useGlobalContext();
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
    }, []);

    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [image, setImage] = React.useState();
    const [tags, setTags] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [titleError, setTitleError] = React.useState(false);
    const [contentError, setContentError] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [tagsError, setTagsError] = React.useState(false);
    const [uniqueError, setUniqueError] = React.useState(false);

    const publishDate = new Date().toISOString().slice(0, 10);
    const author = getUserName();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTitleError(false);
        setContentError(false);
        setImageError(false);
        setTagsError(false);
        setUniqueError(false);

        if (title === '' || content === '' || image === '' || tags === '') {
            if (title === '') {
                setTitleError(true);
            }
            if (content === '') {
                setContentError(true);
            }
            if (image === '') {
                setImageError(true);
            }
            if (tags === '') {
                setTagsError(true);
            }
        }
        else {
            const data = await addBlog({ 'title': title, 'content': content, 'tags': tags, 'publish_date': publishDate, 'author': author });
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
            navigate('/blogs');
        }
    }, [success]);

    if(!specialUser || !authenticated) {
        navigate('/blogs'); 
    }

    return (
        <>
            <div className='add-blog-div'>
                <div className='add-blog-wrapper'></div>
                <section className='add-blog-block'>
                    <header className='add-blog-header'>
                        <h1 className='add-blog-header-text'>Add New Blog</h1>
                    </header>

                    <form className='add-blog-form' onSubmit={handleSubmit}>
                        <div className='add-blog-form-wrapper'>
                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Title</label>
                                <input className='form-input-field' type="text" id="title" placeholder="Title" onChange={
                                    e => setTitle(e.target.value)
                                } />
                                {titleError && <span className='add-blog-error-text'>Title is required</span>}
                                {uniqueError && <span className='add-blog-error-text'>Title already exists for the author</span>}
                            </div>

                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Tags</label>
                                <input className='form-input-field' type="text" id="tags" placeholder="Tags, Seprarate by comma" onChange={
                                    e => setTags(e.target.value)
                                } />
                                {tagsError && <span className='add-blog-error-text'>Tags is required</span>}
                            </div>

                            <div className='content-input-wrapper'>
                                <label className='add-blog-label'>Content</label>
                                <input className='content-input-field' type="text" id="content" placeholder="Content" onChange={
                                    e => setContent(e.target.value)
                                } />
                                {contentError && <span className='add-blog-error-text'>Content is required</span>}
                            </div>
                            <div className='blog-input-wrapper'>
                                <label className='add-blog-label'>Thumbnail</label>
                                <input className='form-input-field' type="file" id="image" placeholder="Image" onChange={
                                    e => setImage(e.target.files[0])
                                } />
                                {imageError && <span className='add-blog-error-text'>Image is required</span>}
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

export default AddBlog;

