import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search=';
const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const currentVideoURL = 'http://127.0.0.1:8000/api/videos/?search='

const AllChaptersInstrunctor = () => {
    // Contexts and Parameters
    const { courseID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [courseName, setCourseName] = React.useState('');
    const [subChapters, setSubChapters] = React.useState([]);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
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

    useEffect(() => {
        // Fetch video names under chapters
        setLoading(true);
        chapters.forEach(async (chapter) => {
            console.log(`${currentVideoURL}${chapter.id}`);
            const fetchVideos = async () => {
                try {
                    const response = await fetch(`${currentVideoURL}${chapter.id}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.length > 0) {
                        const videos = data.map(v => {
                            console.log(v);
                            return {
                                id: v.id,
                                name: v.name,
                                chapter: v.chapter.id,
                            };
                        });
                        console.log(chapter.id);
                        setSubChapters(oldSubChapters => [...oldSubChapters, videos]);
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            }
            fetchVideos();
            console.log(chapters)
        })
    }, [chapters]);

    useEffect(() => {
        console.log(subChapters);
    }, [subChapters]);

    // Navigator
    let navigate = useNavigate();

    // Functions
    const editChapter = id => e => {
        e.preventDefault();
        console.log(id);
        navigate(`/addvideo/${courseID}/${id}`);
    }

    const chapHasVideo = (id) => {
        let retVal = false;
        subChapters.forEach(chap => {
            console.log(chap[0].chapter);
            console.log(id);
            if (parseInt(chap[0].chapter) == parseInt(id)) {
                retVal = true;
            }
        })
        return retVal;
    }

    const chapVideoIndex = (id) => {
        let retVal = 0;
        subChapters.forEach((chap, index) => {
            console.log(chap[0].chapter);
            console.log(id);
            if (parseInt(chap[0].chapter) == parseInt(id)) {
                retVal = index;
            }
        })
        return retVal;
    }


    // Render
    if (loading) {
        return <Loading />;
    }

    if (!isInstructor) {
        navigate(`/courses/${courseID}`);
    }

    return (
        <>
            <div className='all-chapters-div'>
                <div className='all-chapters-course-name'>
                    <h1>Course: {courseName}</h1>
                </div>
                <div className='all-chapters-block'>
                    <div className='all-chapters-header'>
                        <h1>All Chapters</h1>
                    </div>
                    {chapters.map((c, index) => {
                        return (
                            <div className='all-chapters-chapter-block' key={c.id}>
                                <div className='all-chapters-chapter-name' key={c.id} onClick={editChapter(c.id)}>
                                    <h1>{c.name}</h1>
                                    {subChapters.length > index && chapHasVideo(c.id) ? <ul className='all-chapters-current-videos'>
                                        {subChapters[chapVideoIndex(c.id)].map(v => {
                                            return (
                                                <li key={v.id}>{v.name}</li>
                                            )
                                        })}
                                    </ul> : <p className='all-chapters-current-videos'>No videos in the chapter</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default AllChaptersInstrunctor;