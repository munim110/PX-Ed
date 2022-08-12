import { FaPlus, FaMinus } from 'react-icons/fa';
import ChapterVideoComponent from './VideoComponent';
import React, { useCallback, useState } from 'react';

const CourseChapterComponent = ({ chapter, videos, chapterClickMethod, index }) => {
    const [showVideoList, setShowVideoList] = useState(false);

    const handleChapterClick = useCallback(() => {
        console.log(index);
        chapterClickMethod(index);
    }, [chapterClickMethod, chapter.id]);

    const toggleVideoList = (e) => {
        setShowVideoList(!showVideoList);
    }

    return (
        <div className='chapter-component-body' style={{"margin-bottom": "10px"}}>
            <div className='chapter-component-container'>
                <div className='chapter-component-inner-container'>
                    {showVideoList ? <FaMinus onClick={toggleVideoList} /> : <FaPlus onClick={toggleVideoList} />}
                </div>

                <div className='chapter-component-inner-container' onClick={handleChapterClick}>
                    <h1>{chapter.name}</h1>
                </div>
            </div>
            {showVideoList && <div className='video-component-body-container'>
                {videos && videos.map(video => {
                    return <ChapterVideoComponent key={video.id} video={video} />
                })}
            </div>}
        </div>
    );
}

export default CourseChapterComponent;