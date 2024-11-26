import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/Main.css';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const navi = useNavigate();
    const sliderRef = useRef(null);
    const ws = useRef(null); // WebSocket 인스턴스

    const [autoplaySpeed, setAutoplaySpeed] = useState(17010); // 첫 슬라이드 기본 지속 시간

    // WebSocket 연결
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8070'); // WebSocket 서버 연결
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'navigate' && message.url) {
                navi(message.url); // URL로 이동
            }
        };

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 정리
        };
    }, [navi]);

    // 슬라이드 지속 시간 동적 설정
    const handleBeforeChange = (current, next) => {
        const slideDelays = [17010, 30000]; // 첫 슬라이드: 18초, 두 번째 슬라이드: 3초
        setAutoplaySpeed(slideDelays[next % slideDelays.length]);
    };

    const handleAfterChange = (current) => {
        // 첫 슬라이드로 돌아갈 때 지속 시간 초기화
        if (current === 0) {
            setAutoplaySpeed(17010);
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
                        <source src={`${process.env.REACT_APP_VIDEO_SRC}/1_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 두 번째 슬라이드 (타이머) */}
                <div className="timerBox">
                    <img src={`${process.env.REACT_APP_IMG_SRC}/timerimg.png`} alt="Timer" />
                    <div className="timeWrap">
                        <div className="time">{timeLeft.split(':')[0]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[1]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[2]}</div>
                        <div className="dotdot">:</div>
                        <div className="time">{timeLeft.split(':')[3]}</div>
                    </div>
                    <div className="goMainWrap">
                        <div className="goMainBtn" onClick={goToFirst}></div>
                    </div>
                </div>
            </Slider>
        </div>
    );
}
