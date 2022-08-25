import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context'


import Loading from '../components/Loading'
import EnrolledCourse from '../components/Homepage/EnrolledCoursesComponent';

import { getUserID } from '../Utils';

const enrolledCoursesLink = 'http://127.0.0.1:8000/api/enrolledcourses/?search='
const course_url = 'http://127.0.0.1:8000/api/courses/?search='

const Home = () => {
  const { authenticated, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);

  useEffect(() => {

    const getEnrolledCoursesOfUser = async () => {
      const userID = getUserID();
      const response = await fetch(enrolledCoursesLink + userID);
      const data = await response.json();
      setEnrolledCourses(data);
    }

    const getNewCourses = async () => {
      const response = await fetch(course_url);
      const data = await response.json();

      if (data.length > 0) {
        const reversedData = data.reverse();
        reversedData.slice(0, 5);
        setNewCourses(reversedData);
      }
    }

    setUseNavbar(true);
    setAuthenticated(localStorage.getItem('authenticated'));
    setSpecialUser(localStorage.getItem('specialUser') == true);
    setUser(JSON.parse(localStorage.getItem('user')));
    getEnrolledCoursesOfUser();
    getNewCourses();
  }, []);

  useEffect(() => {
    console.log(newCourses);
    setLoading(false);
  }, [newCourses]);

  if (!authenticated) {
    return <Navigate to='/login' />
  }

  // Render
  if (loading) {
    return <Loading />
  }

  return (
    <div className='homepage-wrapper'>
      <div></div>

      <div className='homepage-container'>
        <h1>Welcome, {user.username}</h1>

        {enrolledCourses.length > 0 && <div className='homepage-enrolled-courses-container'>
          <div className='homepage-enrolled-courses-label'>
            <h2>Your Enrolled Courses</h2>
          </div>
          <div className='enrolled-courses-container'>
            {enrolledCourses.map(course => <EnrolledCourse key={course.id} id={course.course.id} name={course.course.name} thumbnail={course.course.thumbnail} />)}</div>
        </div>
        }

        {newCourses.length > 0 && <div className='homepage-enrolled-courses-container'>
          <div className='homepage-enrolled-courses-label'>
            <h2>Latest Courses</h2>
          </div>
          <div className='enrolled-courses-container'>
            {newCourses.map(course => <EnrolledCourse key={course.id} id={course.id} name={course.name} thumbnail={course.thumbnail} />)}</div>
        </div>
        }
      </div>

      <div></div>
    </div>
  )
}

export default Home
