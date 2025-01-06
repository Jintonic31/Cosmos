import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/SubStart.css';
import { useNavigate, useLocation  } from 'react-router-dom';


function SubStart() {

    const navi = useNavigate();
    const location = useLocation(); // 현재 위치 확인
    const sliderRef = useRef(null);
    const ws = useRef(null); // websocket 인스턴스 저장

    // WebSocket 연결 설정
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8070'); // WebSocket 서버 연결
        ws.current.onopen = () => {
            console.log('WebSocket 연결됨');
        };
        ws.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 종료
        };
    }, []);

    // 버튼 클릭 이벤트 처리
    const handleStartClick = () => {
        // 아이패드에서 http://localhost:3000/selectplanet로 이동
        navi('/selectplanet');

        // WebSocket으로 다른 클라이언트에 메시지 전송
        if (ws.current) {
            ws.current.send(JSON.stringify({ action: 'navigate', url: '/joinauction' }));
        }
    };


    const [autoplaySpeed, setAutoplaySpeed] = useState(3000); // 기본 autoplaySpeed 3000ms로 설정

    // 슬라이드 변경 시 자동 전환 시간을 다르게 설정
    const handleBeforeChange = (current, next) => {
        const slideDelays = [3000, 6000]; // 첫 번째 슬라이드는 3초, 두 번째 슬라이드는 6초
        setAutoplaySpeed(slideDelays[next % slideDelays.length]); // 슬라이드 인덱스에 맞춰 시간 설정
    };


    const settings = {
        autoplay: true,
        autoplaySpeed: autoplaySpeed,
        infinite: true,
        beforeChange: handleBeforeChange, // 슬라이드 전환 시 실행될 함수
        pauseOnHover: false, // 마우스 오버 시 슬라이드 정지 방지
    };

    




    return (
        <div className='outerBox'>
            <Slider className="slider" {...settings} ref={sliderRef}>
                <div className="substartBox">
                    <img src={`${process.env.REACT_APP_IMG_SRC}/substart.png`} alt="서브스타트페이지" />

                    <div className='startBtnWrap'>
                        <div className='startBtn' onClick={handleStartClick}>
                        </div>
                    </div>
                </div>


            </Slider>
        
        </div>
    )
}

export default SubStart

