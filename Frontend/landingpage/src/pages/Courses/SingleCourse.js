import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
import { getUserName, tagArray, ratingToStars, getUserID } from '../../Utils'
import TagsComponent from '../../components/Course/Tags';
import { StarComponent, StarComponentWhite } from '../../components/Course/StarComponent';
import TopReviewComponent from '../../components/Course/TopReviewComponent';

const url = 'http://127.0.0.1:8000/api/courses/'
const courseReviewURL = 'http://127.0.0.1:8000/api/reviews/?search='
const chapterURL = 'http://127.0.0.1:8000/api/chapters/?search='
const enrollmentURL = 'http://127.0.0.1:8000/api/enrolledcourses/'
const enrolledCourses = 'http://127.0.0.1:8000/api/enrolledcourses/?search='
const reviewsURL = 'http://127.0.0.1:8000/api/reviews/'
const addCourseReviewURL = 'http://127.0.0.1:8000/api/add_review/'

function enrollUserToCourse(data) {
    return fetch(enrollmentURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

function postReview(data) {
    return fetch(addCourseReviewURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

function putReview(data, id) {
    return fetch(`${reviewsURL}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(err => console.log(err));
}

const SingleCourse = () => {
    // Contexts and Parameters
    const { id } = useParams();
    const { setCourseSearchTerm } = useGlobalContext();
    const { authenticated, setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

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
    const [enrolled, setEnrolled] = React.useState(false);
    const [userReview, setUserReview] = React.useState('');
    const [reviewInput, setReviewInput] = React.useState('');
    const [reviewError, setReviewError] = React.useState(false);
    const [starInput, setStarInput] = React.useState(0);
    const [starError, setStarError] = React.useState(false);
    const [reviewSuccess, setReviewSuccess] = React.useState(false);

    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser')==='true');
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
                const enrolledResponse = await fetch(`${enrolledCourses}${getUserID()}`);

                const data = await response.json();
                const reviewData = await reviewResponse.json();
                const chapterData = await chapterResponse.json();
                const enrolledData = await enrolledResponse.json();

                console.log(enrolledData);

                // Course data
                setCourse(data);

                // Chapter data
                if (chapterData.length > 0) {
                    setChapterCount(chapterData.length);
                }

                // Review data
                if (reviewData.length > 0) {
                    let starCount = 0;
                    let userReviewIndex = -1;
                    const cs = reviewData.map(c => {
                        starCount += c.rating;
                        return {
                            id: c.id,
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
                            setUserReview(c);
                            setStarInput(c.rating);
                            setReviewInput(c.review);
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

                // Enrollment data
                if (enrolledData.length > 0) {
                    console.log(enrolledData);
                    enrolledData.map(e => {
                        if (parseInt(e.course.id) == parseInt(id)) {
                            setEnrolled(true);
                        }
                    })
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

    useEffect(() => {
        if(reviewSuccess){
            window.location.reload();
            setReviewSuccess(false);
        }
    } , [reviewSuccess]);

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

    const enrollCourse = async () => {
        console.log(course.id);
        console.log(getUserID());
        const data = { course: course.id, user: getUserID() };
        const response = await enrollUserToCourse(data);
        console.log(response);
        window.location.reload();
    }

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewError(false);
        setStarError(false);
        setReviewSuccess(false);

        if (reviewInput == '' || starInput == 0) {
            if (reviewInput == '') {
                setReviewError(true);
            }
            if (starInput == 0) {
                setStarError(true);
            }
        }
        else {
            const data = {
                course: id,
                user: getUserID(),
                review: reviewInput,
                rating: starInput,
            };
            // New Review
            if (userReview == '') {
                const response = await postReview(data);
                console.log(response);
                setReviewInput('');
                setStarInput(0);
                setReviewSuccess(true);
            }
            // Update Review
            else {
                const response = await putReview(data, userReview.id);
                console.log(response);
                setReviewInput('');
                setStarInput(0);
                setReviewSuccess(true);
            }
        }
    }

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
                                {!instructor && authenticated && !enrolled && <button className='enroll-button' onClick={enrollCourse}>Enroll Course</button>}
                                {!instructor && authenticated && enrolled && <Link to={`/chapters/${id}`} className="enroll-button">See Chapters</Link>}
                                {instructor && <Link to={`/editcourse/${id}`} className="enroll-button">Edit Course</Link>}
                                {instructor && <Link to={`/chaptersinstructor/${id}`} className="enroll-button">Edit Chapter</Link>}
                                {instructor && <Link to={`/addchapter/${id}`} className="enroll-button">Add Chapters</Link>}
                                {instructor && <Link to={`/addvideotocourse/${id}`} className="enroll-button">Add Video</Link>}
                                {instructor && <Link to={`/addexamtocourse/${id}`} className="enroll-button">Add Exam</Link>}
                                {instructor && <Link to={`/instructorexams/${id}`} className="enroll-button">Edit Exam</Link>}
                                {instructor && <Link to={`/allexamstoaddquestion/${id}`} className="enroll-button">Add Questions</Link>}
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

                        <div className='review-mark-container'>
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

                        <div>
                            {enrolled ? <div className='add-review-container'>
                                <h3>Add A Review</h3>
                                <form onSubmit={submitReview}>
                                    {userReview == '' ? <h4>Rating: <div className='single-digit-input'><input type="number" min={1} max={5} className='single-digit' onChange={
                                        (e) => {
                                            setStarInput(e.target.value);
                                        }
                                    } /></div> / 5</h4> :
                                        <h4>Rating: <div className='single-digit-input'><input type="number" min={1} max={5} defaultValue={parseInt(userReview.rating)} className='single-digit' onChange={
                                            (e) => {
                                                setStarInput(e.target.value);
                                            }
                                        } /></div> / 5</h4>}
                                    {starError && <span className='add-blog-error-text'>Rating is required</span>}
                                    <div className='content-input-wrapper' style={{ "height": "138px" }}>
                                        {userReview == '' ? <input className='content-input-field' type="text" id="review" placeholder="Write Review" onChange={
                                            (e) => {
                                                setReviewInput(e.target.value);
                                            }
                                        } /> : <input className='content-input-field' type="text" id="review" placeholder="Write Review" defaultValue={userReview.review} onChange={
                                            (e) => {
                                                setReviewInput(e.target.value);
                                            }
                                        } />}
                                        {reviewError && <span className='add-blog-error-text'>Review is required</span>}
                                    </div>
                                    <div className='blog-input-wrapper'>
                                        {userReview == '' ? <button className='form-submit-button add-blog-button-margin' type="submit">Add Review</button> : <button className='form-submit-button add-blog-button-margin' type="submit">Update Review</button>}
                                    </div>
                                </form>
                            </div> : <></>}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default SingleCourse;