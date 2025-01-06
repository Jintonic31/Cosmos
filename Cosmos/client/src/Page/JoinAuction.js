import React, { useState, useEffect, useRef } from 'react'; // 1-1 React에서 필요한 hooks 가져오기
import { useNavigate } from 'react-router-dom'
import '../Style/JoinAuction.css'; // 1-2 스타일링을 위한 CSS 파일 가져오기

export default function JoinAuction() {

    const navi = useNavigate();
    const reactUrl = process.env.REACT_APP_MAIN_SRC;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const videoRef = useRef(null); // 1-3 비디오 요소의 참조 생성



    // 기능 1: /joinauction 경로에서 페이지 새로고침 시 홈페이지로 리다이렉션
    useEffect(() => {
        const currentPath = window.location.pathname; // 1-7 현재 URL 경로 가져오기
        const isPageReloaded = window.performance?.navigation?.type === 1; // 1-8 페이지가 새로고침되었는지 확인

        if (currentPath === '/joinauction' && isPageReloaded) { // 1-9 /joinauction에서 새로고침 시에만 리다이렉션
            window.location.href = `${reactUrl}`; // 1-10 홈페이지로 리다이렉션 수행
        }

        // WebSocket 네비게이션 플래그 초기화
        sessionStorage.removeItem('websocket-navigation');


    }, [reactUrl]); // 1-11 컴포넌트가 마운트될 때 한 번만 실행


    // WebSocket 설정
    useEffect(() => {
        ws.current = new WebSocket(`${socketUrl}`);

        ws.current.onopen = () => {
            console.log('JoinAuction에서 WebSocket 연결됨');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'navigate' && message.url === '/loadingauction') {
                navi(message.url); // WebSocket 메시지를 통해 /loadingauction으로 이동
            }
        };

        ws.current.onclose = () => {
            console.log('JoinAuction에서 WebSocket 연결 종료');
        };

        return () => {
            ws.current.close(); // 컴포넌트 언마운트 시 WebSocket 연결 해제
        };
    }, [navi]);



    // 컴포넌트 렌더링
    return (
        <div className="jouterBox">

            <img src={`${process.env.REACT_APP_IMG_SRC}/joinbackimg.png`} alt='joinVideo' className='joinBackimg'/>

            <img src={`${process.env.REACT_APP_IMG_SRC}/videorectangle.png`} alt='videorectangle' className='rectangleimg1'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/videorectangle.png`} alt='videorectangle' className='rectangleimg2'/>
            <img src={`${process.env.REACT_APP_IMG_SRC}/videorectangle.png`} alt='videorectangle' className='rectangleimg3'/>
            

            <div className="jplayerBox">
                <video
                    ref={videoRef} // 4-3 비디오 참조 연결
                    className="jvideoPlayer" // 4-4 비디오 플레이어 스타일 적용
                    autoPlay // 4-5 비디오 자동 재생 설정
                    loop // 4-6 비디오 반복 재생 설정
                    muted // 4-7 비디오 음소거 설정
                >
                    <source
                        src={`${process.env.REACT_APP_IMG_SRC}/2_video.mp4`} // 4-8 비디오 소스 URL
                        type="video/mp4" // 4-9 비디오 파일 타입
                    />
                    이 브라우저는 안됨~ {/* 4-10 지원되지 않는 브라우저를 위한 대체 텍스트 */}
                </video>

                <video
                    ref={videoRef} // 4-3 비디오 참조 연결
                    className="jvideoPlayer" // 4-4 비디오 플레이어 스타일 적용
                    autoPlay // 4-5 비디오 자동 재생 설정
                    loop // 4-6 비디오 반복 재생 설정
                    muted // 4-7 비디오 음소거 설정
                >
                    <source
                        src={`${process.env.REACT_APP_IMG_SRC}/2_video.mp4`} // 4-8 비디오 소스 URL
                        type="video/mp4" // 4-9 비디오 파일 타입
                    />
                    이 브라우저는 안됨~ {/* 4-10 지원되지 않는 브라우저를 위한 대체 텍스트 */}
                </video>

                <video
                    ref={videoRef} // 4-3 비디오 참조 연결
                    className="jvideoPlayer" // 4-4 비디오 플레이어 스타일 적용
                    autoPlay // 4-5 비디오 자동 재생 설정
                    loop // 4-6 비디오 반복 재생 설정
                    muted // 4-7 비디오 음소거 설정
                >
                    <source
                        src={`${process.env.REACT_APP_IMG_SRC}/2_video.mp4`} // 4-8 비디오 소스 URL
                        type="video/mp4" // 4-9 비디오 파일 타입
                    />
                    이 브라우저는 안됨~ {/* 4-10 지원되지 않는 브라우저를 위한 대체 텍스트 */}
                </video>

            </div>
        </div>
    );
}

