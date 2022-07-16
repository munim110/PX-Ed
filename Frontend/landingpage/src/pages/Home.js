import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context'

const Home = () => {
  const { authenticated , setUseNavbar } = useGlobalContext();
  
  useEffect(() => {
    setUseNavbar(true);
  }, []);

  if(!authenticated) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <h2>home page</h2>
    </div>
  )
}

export default Home
