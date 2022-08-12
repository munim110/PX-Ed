import { FaCheck } from 'react-icons/fa';
import React, { useCallback, useState } from 'react';

const ChapterVideoComponent = ({ video, index, videoClickMethod, chapterIdx, isWatched }) => {

    console.log(isWatched);

    const handleVideoClick = useCallback(() => {
        console.log(chapterIdx);
        videoClickMethod(index, chapterIdx);
    }, [videoClickMethod, video.id]);

    return (
        <div className='chapter-component-body' onClick={handleVideoClick}>
            <div className='video-component-container'>
                <div className='video-name-container'>
                    <h2>{video.name}</h2>
                </div>

                {isWatched && <FaCheck />}
            </div>
        </div>
    );
}

export default ChapterVideoComponent;