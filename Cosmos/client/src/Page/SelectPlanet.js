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
        // 첫 슬라이드에서 prev 버튼 숨김
        prevArrow: (
            <button
                type="button"
                className={`slick-prev`} // 조건: 첫 슬라이드에서 hidden 클래스 추가
            >
                <img src={`${process.env.REACT_APP_IMG_SRC}/prearrow.png`} alt="Previous" className={`pbutton_img${currentSlide}`}/>
            </button>
        ),
        // 마지막 슬라이드에서 next 버튼 숨김
        nextArrow: (
            <button
                type="button"
                className={`slick-next`} // 조건: 마지막 슬라이드에서 hidden 클래스 추가
            >
                <img src={`${process.env.REACT_APP_IMG_SRC}/nextarrow.png`} alt="Next" className={`nbutton_img${currentSlide}`}/>
            </button>
        ),
        beforeChange: (_, next) => {
            setCurrentSlide(next); // 슬라이드 변경 시 현재 슬라이드 상태 업데이트
        },
    };


    return (
      <div className="souterBox">
        <Slider className="sslider" {...settings} ref={sliderRef}>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/firstpl.png`} alt="wjoin" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="Planet 2" className='joinbtn' onClick={handleJoinClick}/>
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/secondpl.png`} alt="Planet 2" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="gjoin" className='joinbtn' />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/thirdpl.png`} alt="Planet 3" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="wjoin" className='joinbtn' onClick={handleJoinClick} />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/fourthpl.png`} alt="Planet 4" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/whitejoin.png`} alt="wjoin" className='joinbtn' onClick={handleJoinClick} />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/fifthpl.png`} alt="Planet 5" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="gjoin" className='joinbtn' />
          </div>
          <div className="choiceplanet">
            <img src={`${process.env.REACT_APP_IMG_SRC}/sixthpl.png`} alt="Planet 6" className='planetimg'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/grayjoin.png`} alt="gjoin" className='joinbtn' />
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
