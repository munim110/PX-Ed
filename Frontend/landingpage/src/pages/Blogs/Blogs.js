import React, { useEffect } from 'react'
import SearchForm from '../../components/BlogSearchForm'
import AllBlogs from '../../components/AllBlogs'
import { useGlobalContext } from '../../context'

const Blogs = () => {
    const { useNavbar, setUseNavbar } = useGlobalContext();
    useEffect(() => {
        setUseNavbar(true);
    }, []);
    return (
        <main>
            <SearchForm />
            <AllBlogs />
        </main>
    )
}

export default Blogs