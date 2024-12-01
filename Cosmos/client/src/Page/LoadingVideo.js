import React, {  useState, useEffect, useRef  } from 'react';
import Slider from 'react-slick';
import '../Style/LoadingVideo.css';
import { useNavigate } from 'react-router-dom';

function LoadingVideo() {
    const navi = useNavigate();
    const reactUrl = `${process.env.REACT_APP_MAIN_SRC}substart`;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const [autoplaySpeed, setAutoplaySpeed] = useState(6005);

    // 기능 1: /loadingvideo 경로에서 페이지 새로고침 시 홈페이지로 리다이렉션
    useEffect(() => {
        const currentPath = window.location.pathname; // 1-7 현재 URL 경로 가져오기
        const isPageReloaded = window.performance?.navigation?.type === 1; // 1-8 페이지가 새로고침되었는지 확인

        if (currentPath === '/loadingvideo' && isPageReloaded) { // 1-9 /loadingvideo 새로고침 시에만 리다이렉션
            window.location.href = `${reactUrl}`; // 1-10 홈페이지로 리다이렉션 수행
        }

        // WebSocket 네비게이션 플래그 초기화
        sessionStorage.removeItem('websocket-navigation');


    }, [reactUrl]); // 1-11 컴포넌트가 마운트될 때 한 번만


    useEffect(() => {
        // WebSocket 연결 설정
        ws.current = new WebSocket(`${socketUrl}`);
    
        ws.current.onopen = () => {
            console.log('InputMoney에서 WebSocket 연결됨');
        };
    
        ws.current.onclose = () => {
            console.log('InputMoney에서 WebSocket 연결 종료');
        };
    
        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 정리
        };
      }, []);

      

    const handleSubstartClick = () => {
        // iPad에서 /inputmoney로 로컬 네비게이션
        navi('/substart');

        // 다른 클라이언트에 알리기 위해 WebSocket 메시지 전송
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ action: 'navigate', url: '/' });
            ws.current.send(message);
        }
    }



    const handleBeforeChange = (current, next) => {
        const slideDelays = [6005, 3000];;
        setAutoplaySpeed(slideDelays[next % slideDelays.length]);
    };


    const settings = {
        autoplay: true,
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
                        muted
                    >
                        <source src={`${process.env.REACT_APP_VIDEO_SRC}/3_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 성공 이미지 슬라이드 */}
                <div className="lsuccessBox">
                    <img src={`${process.env.REACT_APP_IMG_SRC}/done.png`} alt="Success" />
                    <div className="lgohomeBox">
                        <div className="lgohomeBtn" onClick={handleSubstartClick} >
                            <img src={`${process.env.REACT_APP_IMG_SRC}/gohomeBtn.png`} alt="Go Home" />
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
}

export default LoadingVideo;
