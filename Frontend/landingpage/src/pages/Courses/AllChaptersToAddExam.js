import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';
const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const examURL = 'http://127.0.0.1:8000/api/exams/?search='

const AllChaptersToAddExam = () => {
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [courseName, setCourseName] = React.useState('');
    const [chaptersWithoutExam, setChaptersWithoutExam] = React.useState([]);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    // Load course
    useEffect(() => {
        // Fetch course info
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CourseURL}${courseID}/`);
                const data = await response.json();
                console.log(data);
                if (JSON.parse(localStorage.getItem('user'))) {
                    if (getUserName() === data.instructor) {
                        setIsInstructor(true);
                    }
                }
                setCourseName(data.name);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseID]);

    // Load chapters
    useEffect(() => {
        if (isInstructor) {
            const fetchChapters = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${chapterURL}${courseID}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.length > 0) {
                        const chap = data.map(c => {
                            console.log(c);
                            return {
                                id: c.id,
                                name: c.name,
                            };
                        });
                        setChapters(chap);
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            }
            fetchChapters();
        }
    }, [isInstructor]);

    // Load chapters without exam
    useEffect(() => {
        if (isInstructor) {
            const fetchChaptersWithoutExam = async () => {
                setLoading(true);
                chapters.map(async (chapter) => {
                    try {
                        const response = await fetch(`${examURL}${chapter.id}`);
                        const data = await response.json();
                        if (data.length === 0) {
                            setChaptersWithoutExam(chaptersWithoutExam => [...chaptersWithoutExam, chapter]);
                        }
                    } catch (err) {
                        console.log(err)
                    } finally {
                        setLoading(false);
                    }
                })
            }
            console.log(chapters);
            fetchChaptersWithoutExam();
        }
    }, [chapters]);

    useEffect(() => {
        if (chaptersWithoutExam.length > 0) {
            console.log(chaptersWithoutExam);
        }
    }, [chaptersWithoutExam]);

    // Navigator
    let navigate = useNavigate();

    // Functions
    const addExam = id => e => {
        e.preventDefault();
        console.log(id);
        navigate(`/addexam/${courseID}/${id}`);
    }

    // Render
    if (loading) {
        return <Loading />
    }

    if (chaptersWithoutExam.length === 0) {
        return (
            <>
                <div className='all-chapters-div'>
                    <div className='all-chapters-course-name'>
                        <h1>Course: {courseName}</h1>
                    </div>

                    <div className='all-chapters-block'>
                        <div className='all-chapters-header'>
                            <h1>All Chapters Without Exam</h1>
                        </div>
                        <h1>No chapters without exam</h1>
                    </div>
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <div className='all-chapters-div'>
                    <div className='all-chapters-course-name'>
                        <h1>Course: {courseName}</h1>
                    </div>

                    <div className='all-chapters-block'>
                        <div className='all-chapters-header'>
                            <h1>Select Chapter To Add Exam</h1>
                        </div>
                        {chaptersWithoutExam.map((c) => {
                            return (
                                <div className='all-chapters-chapter-block' key={c.id}>
                                    <div className='all-chapters-chapter-name' onClick={addExam(c.id)}>
                                        <h1>{c.name}</h1>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default AllChaptersToAddExam