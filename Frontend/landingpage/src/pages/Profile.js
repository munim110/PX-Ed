import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { setUseNavbar, authenticated } = useGlobalContext();

    useEffect(() => {
        setUseNavbar(true);
    }, []);

    if (!authenticated) {
        return <Navigate to='/login' />
    }

    return (
        <div>
            <h2>Profile page</h2>
        </div>
    )
}

export default Profile