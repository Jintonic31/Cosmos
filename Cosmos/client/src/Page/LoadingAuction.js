import React, {  useState, useEffect, useRef  } from 'react';
import Slider from 'react-slick';
import '../Style/LoadingAuction.css';
import { useNavigate } from 'react-router-dom';


function LoadingAuction() {

    const navi = useNavigate();
    const reactUrl = process.env.REACT_APP_MAIN_SRC;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const [autoplaySpeed, setAutoplaySpeed] = useState(6005);

    // #1 라인 이미지
    const imgArr1 = [
        process.env.REACT_APP_IMG_SRC +'1_result1.png',
        process.env.REACT_APP_IMG_SRC +'1_result2.png',
        process.env.REACT_APP_IMG_SRC +'1_result3.png',
        process.env.REACT_APP_IMG_SRC +'1_result4.png',
        process.env.REACT_APP_IMG_SRC +'1_result5.png',
        process.env.REACT_APP_IMG_SRC +'1_result6.png',
        process.env.REACT_APP_IMG_SRC +'1_result7.png',
        process.env.REACT_APP_IMG_SRC +'1_result8.png',
        process.env.REACT_APP_IMG_SRC +'1_result9.png',
    ];

    // 무한 스크롤을 위한 이미지 복제
    const duplicatedImages = [...imgArr1, ...imgArr1, ...imgArr1];


    // 기능 1: /loadingauction 경로에서 페이지 새로고침 시 홈페이지로 리다이렉션
    useEffect(() => {
        const currentPath = window.location.pathname; // 1-7 현재 URL 경로 가져오기
        const isPageReloaded = window.performance?.navigation?.type === 1; // 1-8 페이지가 새로고침되었는지 확인

        if (currentPath === '/loadingauction' && isPageReloaded) { // 1-9 /loadingauction 새로고침 시에만 리다이렉션
            window.location.href = `${reactUrl}`; // 1-10 홈페이지로 리다이렉션 수행
        }

        // WebSocket 네비게이션 플래그 초기화
        sessionStorage.removeItem('websocket-navigation');


    }, [reactUrl]); // 1-11 컴포넌트가 마운트될 때 한 번만


    useEffect(() => {
        // WebSocket 연결 설정
        ws.current = new WebSocket(`${socketUrl}`);
        // WebSocket 서버 URL

        ws.current.onopen = () => {
            console.log('LoadingAuction에서 WebSocket 연결됨');
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
            console.log('LoadingAuction에서 WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // WebSocket 연결 해제
        };
    }, [navi]);


    const handleBeforeChange = (current, next) => {
        const slideDelays = [6005, 30000];;
        setAutoplaySpeed(slideDelays[next % slideDelays.length]);
    };

    // 전체 페이지 슬라이더
    const settings1 = {
        autoplay: true,
        autoplaySpeed: autoplaySpeed,
        infinite: false,
        beforeChange: handleBeforeChange,
        pauseOnHover: false,
        arrows: false,
    };



    return (
        <div className="laouterBox">
            <Slider className="laslider" {...settings1}>
                {/* 비디오 슬라이드 */}
                <div className="laplayerBox">
                    <video
                        className="lavideoPlayer"
                        autoPlay
                        muted
                    >
                        <source src={`${process.env.REACT_APP_VIDEO_SRC}/3_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 경매 결과 출력 슬라이드 */}
                <div className="laresultBox">
                    <div className='aresultline1'>
                        {
                            duplicatedImages.map((img, idx) => (
                            <img src={img} alt='' />
                            ))
                        }
                    </div>
                    <div className='aresultline2'>
                        {
                            duplicatedImages.map((img, idx) => (
                            <img src={img} alt='' />
                            ))
                        }
                    </div>
                    <div className='aresultline3'>
                        {
                            duplicatedImages.map((img, idx) => (
                            <img src={img} alt='' />
                            ))
                        }
                    </div>
                    <div className='aresultline4'>
                        {
                            duplicatedImages.map((img, idx) => (
                            <img src={img} alt='' />
                            ))
                        }
                    </div>
                    <div className='aresultline5'>
                        {
                            duplicatedImages.map((img, idx) => (
                            <img src={img} alt='' />
                            ))
                        }
                    </div>
                    <div className='aresultline6'>
                        {
                            duplicatedImages.map((img, idx) => (
                                <img key={idx} src={img} alt='' />
                            ))
                        }
                    </div>
                </div>
            </Slider>
        </div>
    )
}

export default LoadingAuction
