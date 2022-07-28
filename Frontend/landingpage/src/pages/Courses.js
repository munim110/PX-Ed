import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'

const Courses = () => {
  const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  useEffect(() => {
    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  return (
    <div>
      <h2>Courses page</h2>
    </div>
  )
}

export default Courses
