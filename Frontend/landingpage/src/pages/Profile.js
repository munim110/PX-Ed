import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context'
import Loading from '../components/Loading';
import { getUserID } from '../Utils';
import EnrolledCourse from '../components/Homepage/EnrolledCoursesComponent';

const userApi = 'http://127.0.0.1:8000/api/users/';
const changePasswordURL = 'http://127.0.0.1:8000/api/change-password/';
const enrolledCoursesLink = 'http://127.0.0.1:8000/api/enrolledcourses/?search='

function uploadProfilePicture(id, data) {
    return fetch(`${userApi}${id}/`, {
        method: 'PUT',
        body: data,
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}

const Profile = () => {
    const { setUseNavbar, authenticated, myUser, setAuthenticated, setSpecialUser } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const [updatePasswordError, setUpdatePasswordError] = useState(false);
    const [oldPasswordEmpty, setOldPasswordEmpty] = useState(false);
    const [newPasswordEmpty, setNewPasswordEmpty] = useState(false);
    const [confirmPasswordEmpty, setConfirmPasswordEmpty] = useState(false);
    const [newPasswordNotMatch, setNewPasswordNotMatch] = useState(false);
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);

    const [updateProfilePictureError, setUpdateProfilePictureError] = useState(false);
    const [updateProfilePictureSuccess, setUpdateProfilePictureSuccess] = useState(false);

    const [profileFocused, setProfileFocused] = useState(true);

    useEffect(() => {

        const getUser = async () => {
            const response = await fetch(userApi + getUserID() + "/");
            const data = await response.json();
            setUser(data);
        }

        const getEnrolledCoursesOfUser = async () => {
            const userID = getUserID();
            const response = await fetch(enrolledCoursesLink + userID);
            const data = await response.json();
            setEnrolledCourses(data);
        }

        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
        getUser();
        getEnrolledCoursesOfUser();
    }, []);

    useEffect(() => {
        setLoading(false);
        console.log(enrolledCourses);
    }, [enrolledCourses]);

    useEffect(() => {
        if (updatePasswordSuccess) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [updatePasswordSuccess]);

    useEffect(() => {
        if (updateProfilePictureSuccess) {
            setProfilePicture('');
            window.location.reload();
        }
    }, [updateProfilePictureSuccess]);

    const toggleFocusToProfile = () => {
        setProfileFocused(true);
    }

    const toggleFocusToCourse = () => {
        setProfileFocused(false);
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        setUpdatePasswordSuccess(false);
        setUpdatePasswordError(false);
        setOldPasswordEmpty(false);
        setNewPasswordEmpty(false);
        setConfirmPasswordEmpty(false);
        setNewPasswordNotMatch(false);

        if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
            if (oldPassword === '') {
                setOldPasswordEmpty(true);
            }
            if (newPassword === '') {
                setNewPasswordEmpty(true);
            }
            if (confirmPassword === '') {
                setConfirmPasswordEmpty(true);
            }
        }
        else {
            if (newPassword !== confirmPassword) {
                setNewPasswordNotMatch(true);
            }
            else {
                const data = {
                    old_password: oldPassword,
                    new_password: newPassword,
                }
                const response = await fetch(`${changePasswordURL}${getUserID()}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                console.log(result);
                if (result.result == 'success') {
                    setUpdatePasswordSuccess(true);
                }
                else {
                    setUpdatePasswordError(true);
                }
            }
        }
    }

    const handleProfilePicUpload = async (e) => {
        e.preventDefault();
        setUpdateProfilePictureError(false);
        setUpdateProfilePictureSuccess(false);

        if (profilePicture === '') {
            setUpdateProfilePictureError(true);
        }
        else {
            const formData = new FormData();
            formData.append('profile_pic', profilePicture, profilePicture.name);

            let uploadData = await uploadProfilePicture(getUserID(), formData);
            console.log(uploadData);
            setUpdateProfilePictureSuccess(true);
        }
    }

    if (loading) {
        return <Loading />
    }

    if (profileFocused) {
        return (
            <div className='profile-page-wrapper'>
                <div></div>

                <div className='homepage-container'>
                    <div className='profile-image-name-container'>
                        <div className='image-cropper'>
                            <img src={user.profile_pic} alt={user.username} className='profile-pic' />
                        </div>
                        <h2>{user.username}</h2>
                    </div>
                    <div className='profile-navbar'>
                        <div className='profile-container-elements' onClick={toggleFocusToProfile}>
                            <h3 style={{ color: "#355dfc" }}>Your Profile</h3>
                        </div>
                        <div className='profile-container-elements' onClick={toggleFocusToCourse}>
                            <h3>Your Courses</h3>
                        </div>
                    </div>

                    <div className='edit-profile-section'>
                        <h2>User Profile</h2>
                        <div className='show-info'>
                            <div><h3>UserName</h3></div>
                            <div><h3>{user.username}</h3></div>
                            <div><h3>Email</h3></div>
                            <div><h3>{user.email}</h3></div>
                        </div>
                        <h2>Update Profile</h2>
                        <div className='edit-profile-form'>
                            <h3>Update Password</h3>
                            <form onSubmit={updatePassword}>
                                <div className='blog-input-wrapper'>
                                    <label className='add-blog-label'>Old Password</label>
                                    <input type='password' className='update-profile-form-field' id='OldPassword' placeholder='Old Password' onChange={(e) => setOldPassword(e.target.value)} />
                                    {oldPasswordEmpty && <span className='add-blog-error-text'>Old Password is required</span>}
                                    {updatePasswordError && <span className='add-blog-error-text'>Old Password is incorrect</span>}
                                </div>

                                <div className='blog-input-wrapper'>
                                    <label className='add-blog-label'>New Password</label>
                                    <input type='password' className='update-profile-form-field' id='NewPassword' placeholder='New Password' onChange={(e) => setNewPassword(e.target.value)} />
                                    {newPasswordEmpty && <span className='add-blog-error-text'>New Password is required</span>}
                                </div>

                                <div className='blog-input-wrapper'>
                                    <label className='add-blog-label'>Confirm Password</label>
                                    <input type='password' className='update-profile-form-field' id='ConfirmPassword' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} />
                                    {confirmPasswordEmpty && <span className='add-blog-error-text'>Confirm Password is required</span>}
                                    {newPasswordNotMatch && <span className='add-blog-error-text'>New Password and Confirm Password do not match</span>}
                                </div>
                                <div className='blog-input-wrapper'>
                                    <button className='enroll-button' type="submit">Update Password</button>
                                    {updatePasswordSuccess && <span className='add-success-text'>Password updated successfully</span>}
                                </div>
                            </form>
                        </div>

                        <div className='edit-profile-form'>
                            <h3>Update Profile Picture</h3>
                            <form onSubmit={handleProfilePicUpload}>
                                <div className='blog-input-wrapper'>
                                    <label className='add-blog-label'>New Profile Picture</label>
                                    <input className='update-profile-form-field' type="file" id="image" placeholder="Image" onChange={
                                        e => setProfilePicture(e.target.files[0])
                                    } />
                                    {updateProfilePictureError && <span className='add-blog-error-text'>Profile Picture is required</span>}
                                    <div className='blog-input-wrapper'>
                                        <button className='enroll-button' type="submit">Update Profile Picture</button>
                                        {updateProfilePictureSuccess && <span className='add-success-text'>Profile Picture updated successfully</span>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div></div>
            </div>
        )
    }
    else {
        return (
            <div className='profile-page-wrapper'>
                <div></div>

                <div className='homepage-container'>
                    <div className='profile-image-name-container'>
                        <div className='image-cropper'>
                            <img src={user.profile_pic} alt={user.username} className='profile-pic' />
                        </div>
                        <h2>{user.username}</h2>
                    </div>
                    <div className='profile-navbar'>
                        <div className='profile-container-elements' onClick={toggleFocusToProfile}>
                            <h3>Your Profile</h3>
                        </div>
                        <div className='profile-container-elements' onClick={toggleFocusToCourse}>
                            <h3 style={{ color: "#355dfc" }}>Your Courses</h3>
                        </div>
                    </div>

                    {enrolledCourses.length > 0 ? <div className='homepage-enrolled-courses-container'>
                        <div className='enrolled-courses-container'>
                            {enrolledCourses.map(course => <EnrolledCourse key={course.id} id={course.course.id} name={course.course.name} thumbnail={course.course.thumbnail} />)}</div>
                    </div>
                        : <div className='enrolled-courses-container'>
                            <h2>You have not enrolled in any courses</h2>
                        </div>
                    }

                </div>

                <div></div>
            </div>
        )
    }
}

export default Profile