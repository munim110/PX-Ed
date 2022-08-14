import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context'

import SearchForm from '../../components/CourseSearchForm'
import AllCourses from '../../components/AllCourses'
import AddCourse from '../../components/AddCourses'
import Loading from '../../components/Loading'

const Courses = () => {
  const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUseNavbar(true);
    setLoading(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    console.log(localStorage.getItem('specialUser'));
    setSpecialUser(localStorage.getItem('specialUser'));
  }, []);

  useEffect(() => {
    console.log(specialUser);
    if(loading){
      setLoading(false);
    }
  }, [specialUser]);

  if(loading){
    return <Loading />
  }

  if(specialUser){
    return (
      <main>
        <AddCourse />
        <SearchForm />
        <AllCourses />
      </main>
    )
  }
  else{
    console.log(specialUser)
    return (
      <main>
        <SearchForm />
        <AllCourses />
      </main>
    )
  }
}

export default Courses
