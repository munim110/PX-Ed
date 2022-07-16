import React from 'react'
import { useGlobalContext } from '../context'

const AnalysisPage = () => {
    const { useNavbar, setUseNavbar } = useGlobalContext();
    setUseNavbar(true)
    return (
        <div>
            <h2>analysis page</h2>
        </div>
    )
}

export default AnalysisPage
