import { FaPlus, FaMinus } from 'react-icons/fa';
import ChapterVideoComponent from './VideoComponent';
import React, { useCallback, useState } from 'react';

const CourseChapterComponent = ({ chapter, videos, chapterClickMethod, index, videoClickMethod, isWatchedArray }) => {
    const [showVideoList, setShowVideoList] = useState(false);

    const handleChapterClick = useCallback(() => {
        console.log(index);
        chapterClickMethod(index);
    }, [chapterClickMethod, chapter.id]);

    const toggleVideoList = (e) => {
        setShowVideoList(!showVideoList);
    }

    const isVideoWatched = (videoId) => {
        let retVal = false;
        console.log(isWatchedArray);
        if (isWatchedArray.length > 0) {
            isWatchedArray.map(video => {
                console.log(videoId);
                if (parseInt(video.video_id) == parseInt(videoId)) {
                    console.log('true');
                    retVal = true;
                }
            })
            console.log(retVal);
        }
        return retVal;
    }

    return (
        <div className='chapter-component-body' style={{ "marginBottom": "10px" }}>
            <div className='chapter-component-container'>
                <div className='chapter-component-inner-container'>
                    {showVideoList ? <FaMinus onClick={toggleVideoList} /> : <FaPlus onClick={toggleVideoList} />}
                </div>

                <div className='chapter-component-inner-container' onClick={handleChapterClick}>
                    <h1>{chapter.name}</h1>
                </div>
            </div>
            {showVideoList && <div className='video-component-body-container'>
                {videos && videos.map((video, idx) => {
                    return <ChapterVideoComponent key={video.id} video={video} videoClickMethod={videoClickMethod} index={idx} chapterIdx={index} isWatched={isVideoWatched(video.id)} />
                })}
            </div>}
        </div>
    );
}

export default CourseChapterComponent;