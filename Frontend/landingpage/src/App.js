import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import pages
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Courses from './pages/Courses'
import SingleBlog from './pages/Blogs/SingleBlogPage'
import Blogs from './pages/Blogs/Blogs'
import Analysis from './pages/Analysis'
import Error from './pages/Error'
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage'
import ProfilePage from './pages/Profile'

import { useGlobalContext } from './context'
// import components
import Navbar from './components/Navbar'
function App() {
  const { useNavbar, myUser, setMyUser, setAuthenticated, authenticated } = useGlobalContext();

  useEffect(() => {
    (
      async () => {
        const user = await localStorage.getItem('user');
        if (user) {
          setMyUser(JSON.parse(user));
          setAuthenticated(true);
        }
      }
    )();
  }, []);

  return (
    <Router>
      { useNavbar && <Navbar /> }
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App
