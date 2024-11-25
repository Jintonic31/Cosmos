import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/SelectPlanet.css';
import { useNavigate } from 'react-router-dom';

function SelectPlanet() {
  const navi = useNavigate();
  const sliderRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스 추적

  const settings = {
    autoplay: false,
    infinite: false,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: (
      <button
        type="button"
        className={`slick-prev ${currentSlide === 0 ? 'hidden' : ''}`} // 첫 번째 슬라이드에서 숨김
      >
        <img src={`${process.env.REACT_APP_IMG_SRC}/prearrow.png`} alt="Previous" />
      </button>
    ),
    nextArrow: (
      <button
        type="button"
        className={`slick-next ${currentSlide === 5 ? 'hidden' : ''}`} // 마지막 슬라이드에서 숨김
      >
        <img src={`${process.env.REACT_APP_IMG_SRC}/nextarrow.png`} alt="Next" />
      </button>
    ),
    beforeChange: (_, next) => {
      console.log('Before Change Triggered - Next Slide:', next); // 디버깅 로그
      setCurrentSlide(next); // 현재 슬라이드 상태 업데이트
    },
  };

  const goInputMoney = () => {
    navi('/inputmoney')
  }

  return (
    <div className="souterBox">
      <Slider className="sslider" {...settings} ref={sliderRef}>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/firstpl.png`} alt="Planet 1" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={goInputMoney}/>
        </div>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/secondpl.png`} alt="Planet 2" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="Planet 2" className='joinbtn' />
        </div>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/thirdpl.png`} alt="Planet 3" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={goInputMoney} />
        </div>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/fourthpl.png`} alt="Planet 4" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={goInputMoney} />
        </div>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/fifthpl.png`} alt="Planet 5" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="Planet 2" className='joinbtn' />
        </div>
        <div className="choiceplanet">
          <img src={`${process.env.REACT_APP_IMG_SRC}/sixthpl.png`} alt="Planet 6" className='planetimg'/>
          <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="Planet 2" className='joinbtn' />
        </div>
      </Slider>

      <div className="gohomeBox">
        <div className="gohomeBtn" onClick={() => navi('/substart')}>
          <img src={`${process.env.REACT_APP_IMG_SRC}/gohomeBtn.png`} alt="Go Home" />
        </div>
      </div>
    </div>
  );
}

export default SelectPlanet;
