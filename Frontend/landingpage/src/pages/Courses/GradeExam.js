import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { FaCheck, FaExclamation } from 'react-icons/fa';
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const examAttemptURL = 'http://127.0.0.1:8000/api/exam-attempt/?search='
const examURL = 'http://127.0.0.1:8000/api/exams/'

const AllExamAttempts = () => {
    const { ExamID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [examAttempts, setExamAttempts] = React.useState([]);
    const [examName, setExamName] = React.useState('');

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    // Load exam attempts
    useEffect(() => {
        setLoading(true);
        const fetchExamAttempts = async () => {
            try {
                const response = await fetch(`${examAttemptURL}${ExamID}`);
                const data = await response.json();
                setExamAttempts(data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        //Fetch Exam Info
        const fetchExam = async () => {
            try {
                const response = await fetch(`${examURL}${ExamID}/`);
                const data = await response.json();
                setExamName(data.exam_name);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchExamAttempts();
        fetchExam();
    }, [ExamID]);

    useEffect(() => {
        if (examAttempts.length > 0) {
            console.log(examAttempts)
        }
    }, [examAttempts]);

    useEffect(() => {
        if (examName !== '') {
            console.log(examName)
        }
    }, [examName])

    let navigate = useNavigate();

    // Functions
    const gradeExam = (attemptID) => {
        console.log(attemptID)
        navigate(`/checkexam/${attemptID}`)
    }

    //Render
    if (loading) {
        return <Loading />
    }

    if (examAttempts.length === 0) {
        return (
            <>
                <div className='all-chapters-div'>
                    <div className='all-chapters-course-name'>
                        <h1>Exam: {examName}</h1>
                    </div>

                    <div className='all-chapters-block'>
                        <div className='all-chapters-header'>
                            <h1>All Exams Taken</h1>
                        </div>
                        <h1>No Student Has Taken This Exam Yet</h1>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className='all-chapters-div'>

                    <div className='all-chapters-course-name'>
                        <h1>Exam: {examName}</h1>
                    </div>
                    <div className='all-chapters-block'>
                        <div className='all-chapters-header'>
                            <h1>All Exams Taken</h1>
                        </div>
                        {examAttempts.map((examAttempt, index) => {
                            return (
                                <div className='all-chapters-chapter-block' key={examAttempt.id}>
                                    <div className='attempt-component'>

                                        <div className='grade-component' onClick={() => {gradeExam(examAttempt.id)}}>
                                            <div>
                                                <h2>User: {examAttempt.user.username}</h2>
                                            </div>

                                            <div>
                                                {examAttempt.is_graded === false ? <h2>Auto Score: {examAttempt.total_marks} / {examAttempt.exam.total_marks}</h2>
                                                    : <h2>Total Score: {examAttempt.total_marks} / {examAttempt.exam.total_marks}</h2>}
                                            </div>
                                        </div>

                                        <div className='grade-complete'>
                                            {examAttempt.is_graded === false ? <FaExclamation /> : <FaCheck />}
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }
}

export default AllExamAttempts;