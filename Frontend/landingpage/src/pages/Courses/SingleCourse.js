import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
import { getUserName, tagArray, ratingToStars } from '../../Utils'
import TagsComponent from '../../components/Course/Tags';
import { StarComponent, StarComponentWhite } from '../../components/Course/StarComponent';
import TopReviewComponent from '../../components/Course/TopReviewComponent';

const url = 'http://127.0.0.1:8000/api/courses/'
const courseReviewURL = 'http://127.0.0.1:8000/api/reviews/?search='
const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search='

const SingleCourse = () => {
    // Contexts and Parameters
    const { id } = useParams();
    const { setCourseSearchTerm } = useGlobalContext();
    const { useNavbar, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [course, setCourse] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [instructor, setInstructor] = React.useState(false);
    const [reviews, setReviews] = React.useState([]);
    const [totalRating, setTotalRating] = React.useState(0);
    const [totalReviews, setTotalReviews] = React.useState(0);
    const [averageRating, setAverageRating] = React.useState(0.0);
    const [newStars, setNewStars] = React.useState([0, 0, 0, 0, 0]);
    const [chapterCount, setChapterCount] = React.useState(0);
    const [reviewIndex, setReviewIndex] = React.useState(0);

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser'));
    }, []);

    useEffect(() => {
        if (totalReviews > 0) {
            setAverageRating(totalRating / totalReviews);
        }
    }, [totalReviews]);

    useEffect(() => {
        if (totalRating > 0) {
            setAverageRating(totalRating / totalReviews);
        }
    }, [totalRating]);

    useEffect(() => {
        if (averageRating > 0) {
            setNewStars(ratingToStars(averageRating));
        }
    }, [averageRating]);

    useEffect(() => {
        console.log(newStars);
    }, [newStars]);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}${id}/`);
                const reviewResponse = await fetch(`${courseReviewURL}${id}`);
                const chapterResponse = await fetch(`${chapterURL}${id}`);
                const data = await response.json();
                const reviewData = await reviewResponse.json();
                const chapterData = await chapterResponse.json();
                setCourse(data);
                if (chapterData.length > 0) {
                    setChapterCount(chapterData.length);
                }
                if (reviewData.length > 0) {
                    let starCount = 0;
                    let userReviewIndex = -1;
                    const cs = reviewData.map(c => {
                        starCount += c.rating;
                        return {
                            username: c.user.username,
                            review: c.review,
                            rating: c.rating,
                            profile_pic: c.user.profile_pic,
                        }
                    });
                    cs.sort((a, b) => {
                        return a.rating - b.rating;
                    }).reverse();

                    cs.map((c, index) => {
                        if (c.username === getUserName()) {
                            userReviewIndex = index;
                        }
                    });

                    if (userReviewIndex > -1) {
                        let temp = cs[0];
                        cs[0] = cs[userReviewIndex];
                        cs[userReviewIndex] = temp;
                    }

                    console.log(cs);
                    setTotalReviews(cs.length);
                    setTotalRating(starCount);
                    setReviews(cs);
                }
                if (JSON.parse(localStorage.getItem('user'))) {
                    if (getUserName() === data.instructor) {
                        setInstructor(true);
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    // Functions
    const checkNumber = (number) => {
        if (number > reviews.length - 1) {
            return 0;
        }
        if (number < 0) {
            return reviews.length - 1;
        }
        return number;
    };

    const nextReview = () => {
        setReviewIndex((index) => {
            let newIndex = index + 1;
            return checkNumber(newIndex);
        });
    };

    const prevReview = () => {
        setReviewIndex((index) => {
            let newIndex = index - 1;
            return checkNumber(newIndex);
        });
    };

    if (loading) {
        return <Loading />
    }

    return (
        <section className="section">
            <div className="top-dark-bg-container">
                <div className='dark-inner-bg-container'>
                    <div className='dark-bg-main-content'>
                        <div className='course-info'>
                            <h1>{course.name}</h1>
                            <h3>Includes {chapterCount} Chapters</h3>
                            <div className='top-review-container'>
                                <StarComponent starArray={newStars} />
                                <span className='top-review-score'>{averageRating.toPrecision(2)} / 5.0</span>
                            </div>
                            <h3>Instructed By: {course.instructor}</h3>
                            <TagsComponent key={course.id} {...course}></TagsComponent>
                        </div>
                        <div className='course-thumbnail-container'>
                            <img src={course.thumbnail} alt={course.name} />
                            <span>
                                {/* TODO Check if enrolled, if is not, then show enroll button, if is then show chapters */}
                                {!instructor && <Link to={`/courses/${id}`} className='enroll-button'></Link>}
                                {instructor && <Link to={`/addchapter/${id}`} className="enroll-button">Add Chapters</Link>}
                                {instructor && <Link to={`/addvideotocourse/${id}`} className="enroll-button">Add Video</Link>}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='course-body'>
                <div className='course-body-content'>

                    <div className='course-outcome'>
                        <h2>Course Outcome</h2>
                        <div className='outcome-list-container'>
                            <div className='outcome-list-container'>
                                <div className='outcome-list-content'>
                                    <ul className='course-outcome-list'>
                                        {tagArray(course.outcome).map((o, index) => {
                                            return <li key={index}>✓ {o}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='course-description'>
                        <h2>Course Description</h2>
                        {course.description}
                    </div>

                    <div className='target-audience'>
                        <h2>Target Audience</h2>
                        <ul className='target-audience-list'>
                            {tagArray(course.target_audience).map((o, index) => {
                                return <li key={index}>{o}</li>
                            })}
                        </ul>
                    </div>

                    <div className='target-audience'>
                        <h2>Course Outline</h2>
                        <ul className='target-audience-list'>
                            {tagArray(course.outline).map((o, index) => {
                                return <li key={index}>{o}</li>
                            })}
                        </ul>
                    </div>

                    <div className='review-container'>
                        <div>
                            <h2>Reviews</h2>
                            <div className='star-container'>
                                <h2>{averageRating.toPrecision(2)}</h2>
                                <StarComponentWhite starArray={newStars} />
                                Course Rating
                            </div>
                        </div>
                        <div>
                            <TopReviewComponent {...reviews[reviewIndex]} onBackMethod={prevReview} onFrontMethod={nextReview} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default SingleCourse;