import React, { useState, useContext } from 'react'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState('a');
  const [courseSearchTerm, setCourseSearchTerm] = useState('a');
  const [myUser, setMyUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false)
  const [useNavbar, setUseNavbar] = useState(true)
  const [specialUser, setSpecialUser] = useState(false)


  return <AppContext.Provider value={
    {
      loading,
      setLoading,
      blogs,
      setBlogs,
      blogSearchTerm,
      setBlogSearchTerm,
      courseSearchTerm,
      setCourseSearchTerm,
      myUser,
      setMyUser,
      authenticated,
      setAuthenticated,
      useNavbar,
      setUseNavbar,
      specialUser,
      setSpecialUser,
      courses,
      setCourses
    }
  }>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
