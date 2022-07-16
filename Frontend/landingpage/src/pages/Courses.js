import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'

const Courses = () => {
  const { setUseNavbar } = useGlobalContext();
  
  useEffect(() => {
    setUseNavbar(true);
  }, []);

  return (
    <div>
      <h2>Courses page</h2>
    </div>
  )
}

export default Courses
