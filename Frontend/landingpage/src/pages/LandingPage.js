import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const { authenticated } = useGlobalContext();
    const { setUseNavbar } = useGlobalContext();
    
    useEffect(() => {
        setUseNavbar(true);
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
