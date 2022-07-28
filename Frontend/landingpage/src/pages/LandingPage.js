import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const { authenticated } = useGlobalContext();
    const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
    }, []);

    return (
        <>
            <h2>Landing Page</h2>
            <button className='btn'>
                {authenticated ? <Link to='/home'>Get Started</Link> : <Link to='/register'>Get Started</Link>}
            </button>
        </>
    )
}

export default LandingPage
