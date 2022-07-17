import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context'
import { Navigate } from 'react-router-dom';

const localHost = '127.0.0.1:8000';
const userApi = 'http://127.0.0.1:8000/api/users/';

function uploadProfilePicture (id, data){
    return fetch(`${userApi}${id}/`, {
        method: 'PUT',
        body: data,
    })
    .then(res => res.json())
    .catch(err => console.log(err));
}

const Profile = () => {
    const { setUseNavbar, authenticated, myUser } = useGlobalContext();
    const [image, setImage] = useState();
    const [imgSrc, setImgSrc] = useState(`http://${localHost}${myUser.profile_pic}`);
    const [userData, setUserData] = useState(myUser);

    const handleProfilePicUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profile_pic', image, image.name);

        let uploadData = await uploadProfilePicture(myUser.id, formData);
        console.log(uploadData);
        setUserData(uploadData);
    }

    useEffect(() => {
        setUseNavbar(true);
    }, []);

    useEffect(() => {
        let src = `${userData.profile_pic}`;
        if(src.includes(localHost)){
            src = `${userData.profile_pic}`;
        }else{
            src = `http://${localHost}${userData.profile_pic}`;
        }
        setImgSrc(src);
        console.log(userData);
    }, [userData]);

    return (
        <div>
            <h2>Profile page of {myUser.username}</h2>
            <h2>{myUser.email}</h2>
            <div className='image-cropper'>
                <img src={imgSrc} alt={myUser.username} className='profile-pic' />
            </div>
            <form onSubmit={handleProfilePicUpload}>
                <input type='file' onChange={(e) => setImage(e.target.files[0])} /> <br/>
                <button type='submit'>Update Profile Picture</button>
            </form>
        </div>
    )
}

export default Profile