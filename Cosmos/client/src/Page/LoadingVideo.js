import React, {useState, useEffect, useRef} from 'react';
import Slider from 'react-slick';
import '../Style/LoadingVideo.css'
import { useNavigate } from 'react-router-dom';

function LoadingVideo() {

  const navi = useNavigate();
  const [autoplaySpeed, setAutoplaySpeed] = useState(3000); // 기본 autoplaySpeed 3000ms로 설정

  // 슬라이드 변경 시 자동 전환 시간을 다르게 설정
  const handleBeforeChange = (current, next) => {
    const slideDelays = [3000, 6000]; // 첫 번째 슬라이드는 3초, 두 번째 슬라이드는 6초
    setAutoplaySpeed(slideDelays[next % slideDelays.length]); // 슬라이드 인덱스에 맞춰 시간 설정
  };

  // 비디오 로딩 완료 후 상태 변경 (로딩 상태와 무관하게 슬라이드는 계속 넘어가게 함)
  const handleVideoLoad = () => {
    console.log('비디오 로드됨');
  };


  const settings = {
    autoplay: true,
    autoplaySpeed: autoplaySpeed,
    infinite: false,
    beforeChange: handleBeforeChange, // 슬라이드 전환 시 실행될 함수
    pauseOnHover: false, // 마우스 오버 시 슬라이드 정지 방지
  };


  return (
    <div className='louterBox'>
      <Slider className='lslider' {...settings}>

        <div className="lplayerBox">
          <video 
              className='lvideoPlayer' 
              controls
              autoPlay
              muted
              onLoadedData={handleVideoLoad} // 비디오 로딩 완료 시 처리
          >
              <source src={`${process.env.REACT_APP_VIDEO_SRC}/testvideo.mp4`} type="video/mp4" />
              {/* 지원되지 않는 브라우저를 위한 대체 텍스트 */}
              이 브라우저는 안됨~
          </video>
        </div>


        <div className='successBox'>
          <img src={`${process.env.REACT_APP_IMG_SRC}/success.png`} alt='성공' />

          <div className="gohomeBox">
            <div className="gohomeBtn" onClick={() => navi('/substart')}>
              <img src={`${process.env.REACT_APP_IMG_SRC}/gohomeBtn.png`} alt="Go Home" />
            </div>
          </div>

        </div>



      </Slider>
    </div>
  )
}

export default LoadingVideo
