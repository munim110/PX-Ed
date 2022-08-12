const StarComponent = ({ starArray }) => {
    return (
        <div className='review-container-stars'>
            {starArray.map((star, index) => {
                return (
                    <div className="single-star-container" value={index} key={index}>
                        <div className="single-star-fill" style={{ "width": `${parseInt(star * 31)}px` }}>
                            <img className="single-star-outline" src={require("./star-black-bg.png")} value={index} />
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

const StarComponentWhite = ({ starArray }) => {
    return (
        <div className='review-container-stars'>
            {starArray.map((star, index) => {
                return (
                    <div className="single-star-container" value={index} key={index}>
                        <div className="single-star-fill" style={{ "width": `${parseInt(star * 31)}px` }}>
                            <img className="single-star-outline" src={require("./star.png")} value={index} />
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

const StarComponentFFF = ({ starArray }) => {
    return (
        <div className='review-container-stars'>
            {starArray.map((star, index) => {
                return (
                    <div className="single-star-container" value={index} key={index}>
                        <div className="single-star-fill" style={{ "width": `${parseInt(star * 31)}px` }}>
                            <img className="single-star-outline" src={require("./star-white-bg.png")} value={index} />
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export { StarComponent, StarComponentWhite, StarComponentFFF };