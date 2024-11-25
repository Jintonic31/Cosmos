import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/JoinAuction.css';
import { useNavigate } from 'react-router-dom';

export default function JoinAuction() {

    const navi = useNavigate();
    
    const [autoplaySpeed, setAutoplaySpeed] = useState(3000); // 기본 autoplaySpeed 3000ms로 설정

    // 슬라이드 변경 시 자동 전환 시간을 다르게 설정
    const handleBeforeChange = (current, next) => {
        const slideDelays = [3000, 30000]; // 첫 번째 슬라이드는 3초, 두 번째 슬라이드는 6초
        setAutoplaySpeed(slideDelays[next % slideDelays.length]); // 슬라이드 인덱스에 맞춰 시간 설정
    };

    // 비디오 로딩 완료 후 상태 변경 (로딩 상태와 무관하게 슬라이드는 계속 넘어가게 함)
    const handleVideoLoad = () => {
        console.log('비디오 로드됨');
    };

    const settings = {
        autoplay: true,
        autoplaySpeed: autoplaySpeed,
        infinite: true,
        beforeChange: handleBeforeChange, // 슬라이드 전환 시 실행될 함수
        pauseOnHover: false, // 마우스 오버 시 슬라이드 정지 방지
    };


    const sliderRef = useRef(null);

    // 1번 슬라이드로 이동 함수
    const goToFirst = () => {
        if(sliderRef.current){
            sliderRef.current.slickGoTo(0);
        }
    }


  return (
    <div className="outerBox">
            <Slider className="slider" {...settings} ref={sliderRef}>
                <div className="playerBox">
                    <video 
                        className='videoPlayer' 
                        controls
                        autoPlay
                        muted
                        onLoadedData={handleVideoLoad} // 비디오 로딩 완료 시 처리
                    >
                        <source src={`${process.env.REACT_APP_VIDEO_SRC}/testvideo.mp4`} type="video/mp4" />
                        {/* 지원되지 않는 브라우저를 위한 대체 텍스트 */}
                        이 브라우저는 안됨~
                    </video>
                    {/* <div className="playBtn">
                       <img src={`${process.env.REACT_APP_IMG_SRC}/playbtn.png`} alt="play button" />
                    </div> */}
                </div>

                <div className="timerBox">
                    <img src={`${process.env.REACT_APP_IMG_SRC}/timerimg.png`} alt="타이머" />

                </div>

            </Slider>
        </div>
  )
}
