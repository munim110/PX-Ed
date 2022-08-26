import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const examURL = 'http://127.0.0.1:8000/api/exams/?search='
const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';

const AllExamsInstructor = () => {
    // Contexts and Parameters
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [courseName, setCourseName] = React.useState('');
    const [exams, setExams] = React.useState([]);

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
                if (getUserName() === data.instructor) {
                    setIsInstructor(true);
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
        setLoading(true);
        if (isInstructor) {
            const fetchChapters = async () => {
                try {
                    const response = await fetch(`${chapterURL}${courseID}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        const chap = data.map(c => {
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

    // Fetch exams under chapter
    useEffect(() => {
        chapters.forEach(async (chapter) => {
            const fetchExams = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${examURL}${chapter.id}`);
                    const data = await response.json();

                    if (data.length > 0) {
                        // Only one exam per chapter
                        const exam = {
                            id: data[0].id,
                            exam_name: data[0].exam_name,
                            chapter: chapter.id,
                        }
                        setExams(oldExams => [...oldExams, exam]);
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
            fetchExams();
        })
    }, [chapters]);

    useEffect(() => {
        console.log(exams);
    }, [exams]);

    // Navigator
    let navigate = useNavigate();

    // Functions
    const chapterHasExam = (chapter) => {
        let retVal = false;
        exams.forEach(exam => {
            if (parseInt(exam.chapter) == parseInt(chapter)) {
                retVal = true;
            }
        })
        return retVal;
    }

    const getChapterExam = (chapter, toRet) => {
        let retVal = null;
        exams.forEach(exam => {
            if (parseInt(exam.chapter) == parseInt(chapter)) {
                if(parseInt(toRet) == 1)
                {
                    retVal = exam.id;
                }
                else
                {
                    retVal = exam.exam_name;
                }
            }
        })
        return retVal;
    }

    const editexam = exam => e => {
        e.preventDefault();
        console.log(exam);
        navigate('/addquestiontoexam/' + courseID + '/' + exam);
    }

    // Render
    if (loading) {
        return <Loading />;
    }

    if (!isInstructor) {
        navigate(`/course/${courseID}`);
    }

    return (
        <>
            <div className='all-chapters-div'>

                <div className='all-chapters-course-name'>
                    <h1>Course: {courseName}</h1>
                </div>

                <div className='all-chapters-block'>

                    <div className='all-chapters-header'>
                        <h1>Chapters With Exams</h1>
                    </div>

                    {chapters.map(c => {
                        return (
                            <div className='all-chapters-chapter-block' key={c.id}>
                                
                                {chapterHasExam(c.id) ? 
                                    <div className='all-chapters-chapter-name'>
                                        <h1>{c.name}</h1>
                                        <span className='all-chapters-current-videos' onClick={editexam(getChapterExam(c.id,1))}>{getChapterExam(c.id,2)}</span>
                                    </div>
                                : null}

                            </div>
                        )
                    })}

                </div>

            </div>
        </>
    );
}

export default AllExamsInstructor;