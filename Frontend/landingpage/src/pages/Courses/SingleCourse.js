import React from 'react'
import { useEffect } from 'react';
import Loading from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'
import { getUserName, tagArray, ratingToStars } from '../../Utils'
import TagsComponent from '../../components/Course/Tags';

const url = 'http://127.0.0.1:8000/api/courses/'
const courseReviewURL = 'http://127.0.0.1:8000/api/reviews/?search='

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
                const data = await response.json();
                const reviewData = await reviewResponse.json();
                setCourse(data);
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

    if (loading) {
        return <Loading />
    }

    return (
        <section className="section">
            <img src={course.thumbnail} alt={course.title} className="blog-thumbnail" />
            <div className="blog-title">
                <h2>{course.name}</h2>
                <span className='blog-writer'>Instructor: {course.instructor}</span>
                <span>
                    {/* TODO Check if enrolled, if is not, then show enroll button, if is then show chapters */}
                    {!instructor && <Link to={`/courses/${id}`} className='enroll-button'></Link>}
                    {instructor && <Link to={`/addchapter/${id}`} className="enroll-button">Add Chapters</Link>}
                    {instructor && <Link to={`/addvideotocourse/${id}`} className="enroll-button">Add Video</Link>}
                </span>
            </div>
            <div className="course-body">
                <div className="blog-info">
                    <TagsComponent key={course.id} {...course}></TagsComponent>
                </div>

                <div className='blog-content'>
                    {course.description}
                </div>

                <div className='course-target-audience-list'>
                    <h3>Target Audience</h3>
                    <ul>
                        {tagArray(course.target_audience).map(target => {
                            return <li key={target} className='audience-list'>{target}</li>
                        }
                        )}
                    </ul>
                </div>
            </div>

            <div className='course-outcome-outline'>
                <div className='outline-outcome-container'>
                    <h3>Outcome</h3>
                    <div className='outline-outcome-list-container'>
                        <ul>
                            {tagArray(course.outcome).map(outcome => {
                                return <li key={outcome} className='audience-list'>{outcome}</li>
                            }
                            )}
                        </ul>
                    </div>
                </div>

                <div className='outline-outcome-container'>
                    <h3>Outline</h3>
                    <div className='outline-outcome-list-container'>
                        <ul>
                            {tagArray(course.outline).map(outline => {
                                return <li key={outline} className='audience-list'>{outline}</li>
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className='review-container'>
                <div style={{ "width": `100%` }}></div>
                <div className='review-container-main'>
                    <h2>Reviews</h2>
                    <div className='review-container-stars'>
                        {newStars.map((star, index) => {
                            return (
                                <div className="single-star-container" value={index} key={index}>
                                    <div className="single-star-fill" style={{ "width": `${parseInt(star * 31)}px` }}>
                                        <img className="single-star-outline" src={require("./star.png")} value={index} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <h2>{averageRating.toPrecision(2)} / 5.0</h2>
                </div>
                <div style={{ "width": `100%` }}></div>
            </div>

            <div className='review-list'>
                {reviews.length > 0 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[0].profile_pic} alt={reviews[0].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[0].username}</div>
                        <div className='comment-comment-text'>{reviews[0].review}</div>
                    </div>
                </div>}

                {reviews.length > 1 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[1].profile_pic} alt={reviews[1].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[1].username}</div>
                        <div className='comment-comment-text'>{reviews[1].review}</div>
                    </div>
                </div>}

                {reviews.length > 2 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[2].profile_pic} alt={reviews[2].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[2].username}</div>
                        <div className='comment-comment-text'>{reviews[2].review}</div>
                    </div>
                </div>}

                {reviews.length > 3 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[3].profile_pic} alt={reviews[3].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[3].username}</div>
                        <div className='comment-comment-text'>{reviews[3].review}</div>
                    </div>
                </div>}

                {reviews.length > 4 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[4].profile_pic} alt={reviews[4].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[4].username}</div>
                        <div className='comment-comment-text'>{reviews[4].review}</div>
                    </div>
                </div>}

                {reviews.length > 5 && <div className='review-area'>
                    <div className='comment-profile-pic'>
                        <img src={reviews[5].profile_pic} alt={reviews[5].username} className='comment-profile-pic' />
                    </div>
                    <div className='comment-text-section'>
                        <div className='comment-user-name'>{reviews[5].username}</div>
                        <div className='comment-comment-text'>{reviews[5].review}</div>
                    </div>
                </div>}
            </div>

            <div className='all-review-container'>
                <Link to={`/reviews/${id}`} className="enroll-button">Show All Reviews</Link>
            </div>

            {/*TODO Add Add Review option*/}
        </section>
    );
}

export default SingleCourse;