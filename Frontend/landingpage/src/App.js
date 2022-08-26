import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import pages
// Landing Page
import LandingPage from './pages/LandingPage'

// Authentication
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage'

// User Pages
import Home from './pages/Home'
import ProfilePage from './pages/Profile'

// Courses
import Courses from './pages/Courses/Courses'
import AddCourse from './pages/Courses/AddCourses'
import Analysis from './pages/Analysis'
import SingleCourse from './pages/Courses/SingleCourse'
import AddChapter from './pages/Courses/AddChapter'
import AllChaptersInstrunctor from './pages/Courses/AllChaptersToAddVideo'
import AddVideo from './pages/Courses/AddVideoToChapter'
import AllChaptersStudent from './pages/Courses/AllChaptersEnrolled'
import EditCourse from './pages/Courses/EditCourse'
import EditChapter from './pages/Courses/EditChapter'
import AllChaptersInstructor from './pages/Courses/AllChaptersInstructor'

// Exam
import AllChaptersToAddExam from './pages/Courses/AllChaptersToAddExam'
import AddExamToChapter from './pages/Courses/AddExamToChapter'
import AllExamsInstructor from './pages/Courses/AllExamsInstructor'
import EditExam from './pages/Courses/EditExam'
import AllExamsToAddQuestion from './pages/Courses/AllExamsToAddQuestion'
import AddQuestionToExam from './pages/Courses/AddQuestionToExam'
import TakeExam from './pages/Courses/EnrolledExam'

// Blogs
import SingleBlog from './pages/Blogs/SingleBlogPage'
import Blogs from './pages/Blogs/Blogs'
import AddBlog from './pages/Blogs/AddBlog'

// Error
import Error from './pages/Error'

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
      {useNavbar && <Navbar />}
      <Routes>
        // LandingPage
        <Route path="/" element={<LandingPage />} />

        // Authentication
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        // User pages
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />

        // Blogs
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/addblog" element={<AddBlog />} />

        // Courses
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<Courses />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path='/addcourse' element={<AddCourse />} />
        <Route path='/course/:id' element={<SingleCourse />} />
        <Route path='/addchapter/:id' element={<AddChapter />} />
        <Route path='/addvideotocourse/:courseID' element={<AllChaptersInstrunctor />} />
        <Route path='/addvideo/:courseID/:chapterID' element={<AddVideo />} />
        <Route path='/chapters/:courseID' element={<AllChaptersStudent />} />
        <Route path='/editcourse/:courseID' element={<EditCourse />} />
        <Route path='/editchapter/:chapterID' element={<EditChapter />} />
        <Route path='/chaptersinstructor/:courseID' element={<AllChaptersInstructor />} />

        // Exam
        <Route path='/addexamtocourse/:courseID' element={<AllChaptersToAddExam />} />
        <Route path='/addexam/:courseID/:chapterID' element={<AddExamToChapter />} />
        <Route path='/instructorexams/:courseID' element={<AllExamsInstructor />} />
        <Route path='/editexam/:ExamID' element={<EditExam />} />
        <Route path='/addquestiontoexam/:courseID/:ExamID' element={<AddQuestionToExam />} />
        <Route path='/allexamstoaddquestion/:courseID' element={<AllExamsToAddQuestion />} />
        <Route path='/takeexam/:ExamID' element={<TakeExam />} />

        // Error
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App
