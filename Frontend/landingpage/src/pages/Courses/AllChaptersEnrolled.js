import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import Loading from '../../components/Loading';
import CourseChapterComponent from "../../components/Course/ChapterComponent";
import { useGlobalContext } from '../../context'

const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';
const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const currentVideoURL = 'http://127.0.0.1:8000/api/videos/?search='

const AllChaptersStudent = () => {
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [course, setCourse] = React.useState('');
    const [videos, setVideos] = React.useState({});
    const [chapterIndex, setChapterIndex] = React.useState(0);
    const [videoIndex, setVideoIndex] = React.useState(0);
    const [focusOnChapter, setFocusOnChapter] = React.useState(true);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
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
        setLoading(true);
        chapters.forEach(async (chapter) => {
            const fetchVideos = async () => {
                try {
                    const response = await fetch(`${currentVideoURL}${chapter.id}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.length > 0) {
                        const videos = data.map(v => {
                            return {
                                id: v.id,
                                name: v.name,
                            };
                        });
                        setVideos({ [chapter.id]: videos });
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
        console.log(chapters[chapterIndex]);
    }, [videos]);

    // Functions
    const handleChapterClick = (index) => {
        console.log(chapters[index]);
        setChapterIndex(index);
        setVideoIndex(0);
        setFocusOnChapter(true);
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

                    <div>
                        <h2>Chapters</h2>
                        {chapters.map((chapter, index) => {
                            return <CourseChapterComponent key={index} chapter={chapter} videos={videos[chapter.id]} chapterClickMethod={handleChapterClick} index={index} />
                        })}
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className='chapters-container'>
                <h1>All Chapters Student</h1>
                {chapters.map(chapter => {
                    return <CourseChapterComponent key={chapter.id} chapter={chapter} videos={videos[chapter.id]} />
                })}
            </div>
        );
    }
}

export default AllChaptersStudent;