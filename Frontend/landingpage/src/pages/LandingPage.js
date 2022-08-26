import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { Link } from 'react-router-dom'
import logo from '../logo.svg'

const LandingPage = () => {
    const { authenticated } = useGlobalContext();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
    }, []);

    return (
        <div className='landing-page'>
            <div className='landing-page-bg'>
                <div className='landing-page-container'>
                    <img src={logo} width="100" height="100" alt="logo" className='logo' />
                    <h2>PX-Ed</h2>
                    <h3>
                        Start and advacnce your studies with a huge selection of courses from a huge variety of instructors.
                    </h3>
                    <button className='btn-primary'>
                        {authenticated ? <Link to='/home'>Get Started</Link> : <Link to='/register'>Get Started</Link>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
