import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'

import SearchForm from '../../components/CourseSearchForm'
import AllCourses from '../../components/AllCourses'

const Courses = () => {
  const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  useEffect(() => {
    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  return (
    <main>
      <SearchForm />
      <AllCourses />
    </main>
  )
}

export default Courses
