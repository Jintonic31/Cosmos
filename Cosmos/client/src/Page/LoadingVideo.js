import React, { useState } from 'react';
import Slider from 'react-slick';
import '../Style/LoadingVideo.css';
import { useNavigate } from 'react-router-dom';

function LoadingVideo() {
    const navi = useNavigate();
    const [autoplaySpeed, setAutoplaySpeed] = useState(3000);

    const handleBeforeChange = (current, next) => {
        const slideDelays = [3000, 6000];
        setAutoplaySpeed(slideDelays[next % slideDelays.length]);
    };

    const handleVideoLoad = () => {
        console.log('Video loaded');
    };

    const settings = {
        autoplay: false,
        autoplaySpeed: autoplaySpeed,
        infinite: false,
        beforeChange: handleBeforeChange,
        pauseOnHover: false,
        arrows: false,
    };

    return (
        <div className="louterBox">
            <Slider className="lslider" {...settings}>
                {/* 비디오 슬라이드 */}
                <div className="lplayerBox">
                    <video
                        className="lvideoPlayer"
                        autoPlay
                        loop
                        muted
                        onLoadedData={handleVideoLoad}
                    >
                        <source src={`${process.env.REACT_APP_VIDEO_SRC}/3_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 성공 이미지 슬라이드 */}
                <div className="successBox">
                    <img src={`${process.env.REACT_APP_IMG_SRC}/done.png`} alt="Success" />
                    <div className="gohomeBox">
                        <div className="gohomeBtn" onClick={() => navi('/substart')}>
                            <img src={`${process.env.REACT_APP_IMG_SRC}/gohomeBtn.png`} alt="Go Home" />
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
}

export default LoadingVideo;
