import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import logo from '../logo.svg'

const Navbar = () => {
  const { setBlogSearchTerm, authenticated, setAuthenticated, specialUser, setSpecialUser } = useGlobalContext();

  const resetSearchTerm = () => {
    setBlogSearchTerm('');
  }

  let navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('specialUser');
    setAuthenticated(false);
    setSpecialUser(false);
    navigate('/');
  }

  return (
    <div className='navbar-with-profile'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">
          <img src={logo} width="30" height="30" alt="logo" className='logo' />
        </Link>
        <ul className="nav-links">
          {authenticated && <li className="nav-item"><Link to="/home" className="nav-link">Home</Link></li>}
          <li className="nav-item">
            <Link to="/courses" className="nav-link">Courses</Link>
          </li>
          <li className="nav-item">
            <Link to="/blogs" className="nav-link" onClick={resetSearchTerm}>Blogs</Link>
          </li>
          {authenticated && (<li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>)}
        </ul>
      </nav>
      <div className='navbar profile-corner'>
        {authenticated && (<span className="profile-container"><Link to="/profile" className="nav-link">Profile</Link></span>)}
        {authenticated && (<span className="profile-container" onClick={logoutHandler}>Logout</span>)}
      </div>
    </div>
  )
}

export default Navbar
