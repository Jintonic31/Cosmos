import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/SelectPlanet.css';
import { useNavigate } from 'react-router-dom';

function SelectPlanet() {
    const navi = useNavigate();
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const sliderRef = useRef(null);
    const ws = useRef(null); // WebSocket 인스턴스
    const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스 추적

    useEffect(() => {
        // WebSocket 연결 설정
        ws.current = new WebSocket(`${socketUrl}`);
        // ws.current = new WebSocket('ws://localhost:8070/ws'); // WebSocket 서버 URL

        ws.current.onopen = () => {
            console.log('SelectPlanet에서 WebSocket 연결됨');
        };

        ws.current.onclose = () => {
            console.log('SelectPlanet에서 WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 정리
        };
    }, []);

    const handleJoinClick = () => {
      // iPad에서 /inputmoney로 로컬 네비게이션
      navi('/inputmoney');

      // 다른 클라이언트에 알리기 위해 WebSocket 메시지 전송
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ action: 'navigate', url: '/joinauction' });
          ws.current.send(message);
      }
  };

    const settings = {
      autoplay: false,
      infinite: false,
      pauseOnHover: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: (
          <button
              type="button"
              className={`slick-prev ${currentSlide === 0 ? 'hidden' : ''}`} // Hide on the first slide
          >
              <img src={`${process.env.REACT_APP_IMG_SRC}/prearrow.png`} alt="Previous" />
          </button>
      ),
      nextArrow: (
          <button
              type="button"
              className={`slick-next ${currentSlide === 5 ? 'hidden' : ''}`} // Hide on the last slide
          >
              <img src={`${process.env.REACT_APP_IMG_SRC}/nextarrow.png`} alt="Next" />
          </button>
      ),
      beforeChange: (_, next) => {
          console.log('Before Change Triggered - Next Slide:', next); // Debugging log
          setCurrentSlide(next); // Update the current slide state
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
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={handleJoinClick}/>
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/secondpl.png`} alt="Planet 2" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="Planet 2" className='joinbtn' />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/thirdpl.png`} alt="Planet 3" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={handleJoinClick} />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/fourthpl.png`} alt="Planet 4" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={handleJoinClick} />
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
