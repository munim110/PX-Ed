import React, { useEffect } from 'react'
import SearchForm from '../../components/BlogSearchForm'
import AllBlogs from '../../components/AllBlogs'
import AddBlog from '../../components/AddBlog'
import { useGlobalContext } from '../../context'

const Blogs = () => {
    const { specialUser, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
    }, []);

    useEffect(() => {
        console.log(specialUser)
        if(specialUser == true)
        {
            console.log("Special User")
        }
    }, [specialUser])
    return (
        <main>
            {specialUser==true && <AddBlog />}    
            <SearchForm />
            <AllBlogs />
        </main>
    )
}

export default Blogs