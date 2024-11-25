import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../Style/Main.css';
import { useNavigate } from 'react-router-dom';


export default function Main() {
    
    const navi = useNavigate();
    const sliderRef = useRef(null);
    const ws = useRef(null); // WebSocket 인스턴스 저장

    const [autoplaySpeed, setAutoplaySpeed] = useState(3000); // 기본 autoplaySpeed 3000ms로 설정


    // WebSocket 연결 설정
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8070'); // WebSocket 서버 연결
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'navigate' && message.url) {
                navi(message.url); // 전달받은 URL로 이동
            }
        };

        ws.current.onopen = () => {
            console.log('WebSocket 연결 성공');
        };
        ws.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 종료
        };
    }, [navi]);


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
        infinite: true,
        beforeChange: handleBeforeChange, // 슬라이드 전환 시 실행될 함수
        pauseOnHover: false, // 마우스 오버 시 슬라이드 정지 방지
    };

    // 카운트 다운 시간
    const [timeLeft, setTimeLeft] = useState('');
    // 종료 날짜 지정
    const endDate = new Date('2024-12-22T21:00:00')

    // 타이머 업데이트
    const updateTimer = () => {
        const now = new Date(); // 현재 시간
    const remaining = endDate - now; // 종료 날짜와 현재 시간의 차이

        if (remaining <= 0) {
            setTimeLeft("00:00:00:00"); // 만약 카운트다운이 끝났다면 "00:00:00:00"으로 표시
        } else {
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24)); // 남은 일
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 남은 시간
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)); // 남은 분
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000); // 남은 초

            setTimeLeft(`${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }
    };

    // 타이머 시작 (컴포넌트 마운트시)
    useEffect(() => {
        const timer = setInterval(updateTimer, 1000); // 1초마다 업데이트
        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);



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

                    
                    <div className='timeWrap'>
                        <div className='time'>{timeLeft.split(':')[0]}</div>
                        <div className='dotdot'>:</div>
                        
                        <div className='time'>{timeLeft.split(':')[1]}</div>
                        <div className='dotdot'>:</div>

                        <div className='time'>{timeLeft.split(':')[2]}</div>
                        <div className='dotdot'>:</div>
                        
                        <div className='time'>{timeLeft.split(':')[3]}</div>
                    </div>

                    <div className='goMainWrap'>
                        <div className='goMainBtn' onClick={goToFirst}></div>
                    </div>


                </div>

            </Slider>
        </div>
    );
}
