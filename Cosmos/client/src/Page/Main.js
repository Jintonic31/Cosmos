import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/Main.css';
import { useNavigate } from 'react-router-dom';

export default function Main() {

    const navi = useNavigate();
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const sliderRef = useRef(null);
    const [autoplaySpeed, setAutoplaySpeed] = useState(17000);

    useEffect(() => {
        // WebSocket 연결 설정
        ws.current = new WebSocket(`${socketUrl}`);
        // WebSocket 서버 URL

        ws.current.onopen = () => {
            console.log('Main에서 WebSocket 연결됨');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // WebSocket 메시지로부터 URL 수신 후 네비게이션
            if (message.action === 'navigate' && message.url) {
                console.log('네비게이션 실행 중:', message.url);

                // WebSocket 네비게이션 플래그 설정
                sessionStorage.setItem('websocket-navigation', 'true');
                navi(message.url);
            }
        };

        ws.current.onclose = () => {
            console.log('Main에서 WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // WebSocket 연결 해제
        };
    }, [navi]);

    // 슬라이드 지속 시간 동적 설정
    const handleBeforeChange = (current, next) => {
        const slideDelays = [17000, 30000]; // 첫 슬라이드: 17초, 두 번째 슬라이드: 30초
        setAutoplaySpeed(slideDelays[next % slideDelays.length]);
    };

    const handleAfterChange = (current) => {
        // 첫 슬라이드로 돌아갈 때 지속 시간 초기화
        if (current === 0) {
            setAutoplaySpeed(17000);
        }
    };

    // 비디오 로드 완료 처리
    const handleVideoLoad = () => {
        console.log('비디오 로드 완료');
    };

    const settings = {
        autoplay: true,
        autoplaySpeed: autoplaySpeed,
        infinite: true,
        beforeChange: handleBeforeChange,
        afterChange: handleAfterChange, // 슬라이드 변경 후 지속 시간 초기화
        pauseOnHover: false,
    };

    // 타이머 로직
    const [timeLeft, setTimeLeft] = useState('');
    const endDate = new Date('2024-12-22T21:00:00'); // 종료 날짜 설정

    const updateTimer = () => {
        const now = new Date();
        const remaining = endDate - now;

        if (remaining <= 0) {
            setTimeLeft('00:00:00:00'); // 타이머 종료
        } else {
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        }
    };

    useEffect(() => {
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    const goToFirst = () => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    };

    return (
        <div className="outerBox">
            <Slider className="slider" {...settings} ref={sliderRef}>
                {/* 첫 번째 슬라이드 (비디오) */}
                <div className="playerBox">
                    <video
                        className="videoPlayer"
                        autoPlay
                        loop
                        muted
                        onLoadedData={handleVideoLoad} // 비디오 로드 처리
                    >
                        <source src={`${process.env.REACT_APP_IMG_SRC}/1_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className='hiddenBtn' onClick={() => navi('/substart')}></div>
                </div>

                {/* 두 번째 슬라이드 (타이머) */}
                <div className="timerBox">
                    {/* <img src={`${process.env.REACT_APP_IMG_SRC}/timerimg.png`} alt="Timer" /> */}

                    <div className='alterimg'>
                        <div className='timetitle'>
                            <div id='daytitle'>DAYS</div>
                            <div id='hourtitle'>HOURS</div>
                            <div id='mintitle'>MINUTES</div>
                            <div id='sectitle'>SECONDS</div>
                        </div>
                    </div>
                    
                    <div className='hiddenBtn' onClick={() => navi('/substart')}></div>
                    
                    <div className="timeWrap">
                        <div className="time">{timeLeft.split(':')[0]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[1]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[2]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[3]}</div>
                    </div>

                    <div className='goMainWrap'onClick={goToFirst}>
                        <div className='textWrap'>
                            COSMOS N EWHA GALLERY, KOREA<br/>
                            EXPLORED by voyad RESEARCH BY nova LAB AND ORIVEN SLAES<br/>
                            DIRECted by HJY producted by SHR
                        </div>
                        
                    </div>

                    {/* <div className="goMainWrap">
                        <div className="goMainBtn" onClick={goToFirst}></div>
                    </div> */}

                </div>
            </Slider>
        </div>
    );
}

