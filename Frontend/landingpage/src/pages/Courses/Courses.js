import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'

import SearchForm from '../../components/CourseSearchForm'
import AllCourses from '../../components/AllCourses'
import AddCourse from '../../components/AddCourses'

const Courses = () => {
  const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  useEffect(() => {
    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  return (
    <main>
      {specialUser && <AddCourse />}
      <SearchForm />
      <AllCourses />
    </main>
  )
}

export default Courses
