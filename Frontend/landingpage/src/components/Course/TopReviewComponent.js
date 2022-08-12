import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';
import { StarComponentFFF } from './StarComponent';
import { ratingToStars } from '../../Utils';

const TopReviewComponent = ({ username, review, rating, profile_pic, onBackMethod, onFrontMethod }) => {
    return (
        <article className='review'>
            <div className='review-img-container'>
                <img src={profile_pic} alt={username} className='reviewer-img' />
                <span className='quote-icon'>
                    <FaQuoteRight />
                </span>
            </div>
            <h4 className='reviewer'>{username}</h4>
            <StarComponentFFF starArray={ratingToStars(rating)} />
            <p className='review-text'>{review}</p>
            <div>
                <button className='prev-btn' onClick={onBackMethod}>
                    <FaChevronLeft />
                </button>
                <button className='next-btn' onClick={onFrontMethod}>
                    <FaChevronRight />
                </button>
            </div>
        </article>
    );
}

export default TopReviewComponent;