import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context'

const Home = () => {
  const { authenticated, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  useEffect(() => {
    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  if (!authenticated) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <h2>home page</h2>
    </div>
  )
}

export default Home
