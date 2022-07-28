import React, { useEffect } from 'react'
import { useGlobalContext } from '../context'

const AnalysisPage = () => {
    const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
    }, []);
    return (
        <div>
            <h2>analysis page</h2>
        </div>
    )
}

export default AnalysisPage
