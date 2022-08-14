import { FaTrashAlt } from 'react-icons/fa';
import { useCallback } from 'react';

const InstructorVideoComponent = ({ video, index, deleteHandler }) => {
    console.log(video);

    const handleVideoClick = useCallback(() => {

    } , [video.id]);

    return (
        <div className='instructor-video-bar'>
            <div className='instructor-video-bar-inner'>
                {video.name}
            </div>

            <div className='instructor-video-bar-inner'>
                <FaTrashAlt onClick={() => { }} />
            </div>
        </div>
    );
}

export default InstructorVideoComponent;