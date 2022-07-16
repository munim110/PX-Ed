import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'

const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
const blog_url = 'http://127.0.0.1:8000/api/blogs/'
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState('a');
  const [courseSearchTerm, setCourseSearchTerm] = useState('a');
  const [myUser, setMyUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false)
  const [useNavbar, setUseNavbar] = useState(true)


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
      setUseNavbar
    }
  }>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
