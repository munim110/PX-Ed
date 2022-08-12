import { FaCheck } from 'react-icons/fa';

const ChapterVideoComponent = ({ video }) => {
    return (
        <div className='chapter-component-body'>
            <div className='video-component-container'>
                <h2>{video.name}</h2>
            </div>
        </div>
    );
}

export default ChapterVideoComponent;