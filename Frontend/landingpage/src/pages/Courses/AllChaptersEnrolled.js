import React, { useEffect } from 'react'
import { useParams, Link } from "react-router-dom";
import Loading from '../../components/Loading';
import CourseChapterComponent from "../../components/Course/ChapterComponent";
import { useGlobalContext } from '../../context'
import ReactPlayer from 'react-player/lazy'
import { getUserID } from '../../Utils';

const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';
const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const currentVideoURL = 'http://127.0.0.1:8000/api/videos/?search='
const addIsWatchedURL = 'http://127.0.0.1:8000/api/add_is_watched/'
const isWatchedURL = 'http://127.0.0.1:8000/api/is_watched/?search='
const examURL = 'http://127.0.0.1:8000/api/exams/?search='
const examAttemptURL = 'http://127.0.0.1:8000/api/exam-attempt/?search='

function addIsWatched(data) {
    return fetch(addIsWatchedURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

const AllChaptersStudent = () => {
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [course, setCourse] = React.useState('');
    const [videos, setVideos] = React.useState([]);
    const [chapterIndex, setChapterIndex] = React.useState(0);
    const [videoIndex, setVideoIndex] = React.useState(0);
    const [focusOnChapter, setFocusOnChapter] = React.useState(true);
    const [isWatched, setIsWatched] = React.useState({});
    const [exams, setExams] = React.useState([]);
    const [examAttempt, setExamAttempt] = React.useState([]);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    // Fetch course info
    useEffect(() => {
        // Fetch course info
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CourseURL}${courseID}/`);
                const data = await response.json();
                console.log(data);
                setCourse(data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseID]);

    // Fetch Chpater info
    useEffect(() => {
        if (course != '') {
            const fetchChapters = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${chapterURL}${courseID}`);
                    const data = await response.json();
                    console.log(data);
                    setChapters(data);
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            }
            fetchChapters();
        }
    }, [course]);

    // Fetch videos info
    useEffect(() => {
        // Fetch video names under chapters
        console.log(chapters);
        chapters.forEach(async (chapter) => {
            const fetchVideos = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${currentVideoURL}${chapter.id}`);
                    const hasWatchedResponse = await fetch(`${isWatchedURL}${getUserID()}`);
                    const data = await response.json();
                    const hasWatchedData = await hasWatchedResponse.json();
                    console.log(data);
                    if (data.length > 0) {
                        const videoChap = data.map(v => {
                            return {
                                id: v.id,
                                name: v.name,
                                url: v.video,
                                description: v.description,
                                chapter: chapter.id,
                            };
                        });
                        setVideos(oldVids => [...oldVids, videoChap]);
                    }

                    if (hasWatchedData.length > 0) {
                        const isWatched = hasWatchedData.map(v => {
                            return {
                                video_id: v.video.id,
                                isWatched: v.is_watched,
                            };
                        });
                        setIsWatched(isWatched);
                    }

                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            }
            fetchVideos();
        })
    }, [chapters]);

    useEffect(() => {
        console.log(videos);

        chapters.forEach(async (chapter) => {
            console.log(chapter);
            const fetchExams = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${examURL}${chapter.id}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.length > 0) {
                        const examChap = data.map(v => {
                            return {
                                id: v.id,
                                name: v.exam_name,
                                chapter: chapter.id,
                            };
                        });
                        setExams(oldExams => [...oldExams, examChap]);
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            }
            fetchExams();
        })
    }, [videos]);

    useEffect(() => {
        console.log(isWatched);
    }, [isWatched]);

    useEffect(() => {
        console.log(exams);
        // Fetch exam attempt info
        if (exams.length > 0) {
            let exam = exams[exams.length - 1];
            console.log(exam);
            const fetchExamAttempt = async () => {
                setLoading(true);
                try {
                    console.log(exam[0].id);
                    const response = await fetch(`${examAttemptURL}${exam[0].id}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        data.map(attempt => {
                            if (attempt.user.id === getUserID()) {
                                console.log(data);
                                setExamAttempt(oldExamAttempts => [...oldExamAttempts, attempt]);
                            }
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
                finally {
                    setLoading(false);
                }
            }
            fetchExamAttempt();
        }
    }, [exams]);

    useEffect(() => {
        if (examAttempt.length > 0) {
            console.log(examAttempt);
        }
    }, [examAttempt]);

    // Functions
    const handleChapterClick = (index) => {
        console.log(chapters[index]);
        setChapterIndex(index);
        setVideoIndex(0);
        setFocusOnChapter(true);
    }

    const getVideoChapterIndex = (vid) => {
        console.log(vid)
        let retval = 0;
        videos.forEach((vjson, i) => {
            vjson.forEach((v, j) => {
                console.log(v);
                if (parseInt(v.id) == parseInt(vid)) {
                    retval = i;
                }
            })
        })
        return retval;
    }

    const handleVideoClick = (index, chapterIdx) => {
        console.log(videos[getVideoChapterIndex(chapterIdx)])
        setChapterIndex(getVideoChapterIndex(chapterIdx));
        setVideoIndex(index);
        setFocusOnChapter(false);
    }

    useEffect(() => {
        if (!focusOnChapter) {
        }
    }, [focusOnChapter]);


    const onVideoStart = () => {
        console.log('Started Video');
        // Add video to watched
        const data = { video: videos[chapterIndex][videoIndex].id, user: getUserID(), is_watched: true };
        const response = addIsWatched(data);
        console.log(response);
    }

    const chapVideoIndex = (id) => {
        let retVal = 0;
        videos.forEach((chap, index) => {
            if (parseInt(chap[0].chapter) == parseInt(id)) {
                retVal = index;
            }
        })
        return retVal;
    }

    const getChapterVideos = (id) => {
        let retVal = [];
        videos.forEach((chap, index) => {
            if (parseInt(chap[0].chapter) == parseInt(id)) {
                retVal = chap;
            }
        })
        return retVal;
    }

    const chapterHasExams = (id) => {
        let retVal = false;
        exams.map((ex, index) => {
            if (parseInt(ex[0].chapter) == parseInt(id)) {
                retVal = true;
            }
        })
        return retVal;
    }

    const examAlreadyAttempted = (id) => {
        let retVal = false;
        examAttempt.map((ex) => {
            console.log(ex);
            if (parseInt(ex.exam.id) == parseInt(id)) {
                retVal = true;
            }
        }
        )
        return retVal;
    }

    const getExamAttempt = (id) => {
        let retVal = -1;
        examAttempt.map((ex) => {
            if (parseInt(ex.exam.id) == parseInt(id)) {
                retVal = ex.id;
            }
        })
        return retVal;
    }

    const getChapterExam = (id) => {
        let retVal = -1;
        exams.map((ex, index) => {
            if (parseInt(ex[0].chapter) == parseInt(id)) {
                retVal = ex[0].id;
            }
        })
        return retVal;
    }

    if (loading) {
        return <Loading />
    }

    if (focusOnChapter) {
        return (
            <div className='course-body'>
                <div className='chapters-course-name'><h2>Course: {course.name}</h2></div>
                <div className='chapters-course-name'><h3>Chapter: {chapters[chapterIndex].name}</h3></div>

                <div className='course-body-content'>

                    <div className='course-outcome'>
                        <h2>Chapter Outcome</h2>
                        <div className='outcome-list-container'>
                            <div className='outcome-list-container'>
                                <div className='outcome-list-content'>
                                    <h3>{chapters[chapterIndex].outcome}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='course-description'>
                        <h2>Chapter Description</h2>
                        {chapters[chapterIndex].description}
                    </div>

                    <div className='course-description'>

                        {chapterHasExams(chapters[chapterIndex].id) ?
                            <div>
                                <h2>Exam</h2>
                                {examAlreadyAttempted(getChapterExam(chapters[chapterIndex].id)) ? 
                                <Link to={`/examresult/${getExamAttempt(getChapterExam(chapters[chapterIndex].id))}`} className="enroll-button">See Result</Link>
                                : 
                                <Link to={`/takeexam/${getChapterExam(chapters[chapterIndex].id)}`} className="enroll-button">Take Exam</Link>}
                            </div>
                            : null}

                    </div>

                    <div>
                        <h2>Chapters</h2>
                        {chapters.map((chapter, index) => {
                            return <CourseChapterComponent key={index} chapter={chapter} videos={videos[chapVideoIndex(chapter.id)]} chapterClickMethod={handleChapterClick} index={index} videoClickMethod={handleVideoClick} isWatchedArray={isWatched} />
                        })}
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className='course-body'>

                <div className='chapters-course-name'><h2>Course: {course.name}</h2></div>
                <div className='chapters-course-name'><h3>Chapter: {chapters[chapterIndex].name}</h3></div>

                <div className='course-body-content'>

                    <div>
                        <h2>{videos[chapterIndex][videoIndex].name}</h2>
                        <ReactPlayer url={videos[chapterIndex][videoIndex].url} onStart={onVideoStart} controls width="1280px" height="720px" />
                        <h3>{videos[chapterIndex][videoIndex].description}</h3>
                    </div>

                    <div>
                        <h2>Chapters</h2>
                        {chapters.map((chapter, index) => {
                            return <CourseChapterComponent key={index} chapter={chapter} videos={videos[chapVideoIndex(chapter.id)]} chapterClickMethod={handleChapterClick} index={index} videoClickMethod={handleVideoClick} isWatchedArray={isWatched} />
                        })}
                    </div>

                </div>

            </div>
        );
    }
}

export default AllChaptersStudent;