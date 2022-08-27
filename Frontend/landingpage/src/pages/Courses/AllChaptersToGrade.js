import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';
const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const examURL = 'http://127.0.0.1:8000/api/exams/?search='

const AllChaptersToGradeExam = () => {
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [courseName, setCourseName] = React.useState('');
    const [chaptersWithExam, setChaptersWithExam] = React.useState([]);
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

    // Load chapters with exam
    useEffect(() => {
        if (isInstructor) {
            const fetchChaptersWithExam = async () => {
                setLoading(true);
                chapters.map(async (chapter) => {
                    try {
                        const response = await fetch(`${examURL}${chapter.id}`);
                        const data = await response.json();
                        if (data.length !== 0) {
                            setChaptersWithExam(chaptersWithoutExam => [...chaptersWithoutExam, chapter]);
                            setExams(oldExams => [...oldExams, data[0]]);
                        }
                    } catch (err) {
                        console.log(err)
                    } finally {
                        setLoading(false);
                    }
                })
            }
            fetchChaptersWithExam();
        }
    }, [chapters]);

    useEffect(() => {
        if (chaptersWithExam.length > 0) {
            console.log(chaptersWithExam);
        }
    }, [chaptersWithExam]);

    // Navigator
    let navigate = useNavigate();

    const getChapterExam = (chapter, toRet) => {
        let retVal = null;
        console.log(exams);
        exams.forEach(exam => {
            if (parseInt(exam.exam_chapter.id) == parseInt(chapter)) {
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

    const gradeChapter = (examID) => {
        console.log(examID);
        navigate(`/allexamattempts/${examID}`);
    }

    // Render
    if (loading) {
        return <Loading />
    }

    if (chaptersWithExam.length === 0) {
        return (
            <>
                <div className='all-chapters-div'>
                    <div className='all-chapters-course-name'>
                        <h1>Course: {courseName}</h1>
                    </div>

                    <div className='all-chapters-block'>
                        <div className='all-chapters-header'>
                            <h1>All Chapters With Exam</h1>
                        </div>
                        <h1>No chapters with exam</h1>
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
                            <h1>Select Chapter To View Exam</h1>
                        </div>
                        {chaptersWithExam.map((c) => {
                            return (
                                <div className='all-chapters-chapter-block' key={c.id}>
                                    <div className='all-chapters-chapter-name'>
                                        <h1>{c.name}</h1>
                                        <span className='all-chapters-current-videos' onClick={() => {gradeChapter(getChapterExam(c.id,1))}}>{getChapterExam(c.id,2)}</span>
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

export default AllChaptersToGradeExam