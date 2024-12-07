import React, { useState, useEffect, useRef } from 'react'; // 1-1 React에서 필요한 hooks 가져오기
import { useNavigate } from 'react-router-dom'
import '../Style/JoinAuction.css'; // 1-2 스타일링을 위한 CSS 파일 가져오기

export default function JoinAuction() {

    const navi = useNavigate();
    const reactUrl = process.env.REACT_APP_MAIN_SRC;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const videoRef = useRef(null); // 1-3 비디오 요소의 참조 생성
    const playBtnRef = useRef(null); // 1-4 재생 버튼 요소의 참조 생성
    const [isPlaying, setIsPlaying] = useState(true); // 1-5 비디오 재생 상태를 추적하는 상태
    let mouseTimeout = useRef(null); // 1-6 비활성 시 재생 버튼을 숨기기 위한 타임아웃 참조



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



    // 기능 2: 마우스 움직임 시 재생 버튼 표시, 2초 동안 비활성 시 숨기기
    useEffect(() => {
        const handleMouseMove = () => { // 2-1 마우스 움직임을 처리하는 함수 정의
            const playBtn = playBtnRef.current; // 2-2 참조된 재생 버튼 가져오기
            if (playBtn) {
                playBtn.classList.add('show'); // 2-3 버튼에 'show' 클래스 추가 (표시)
            }
            if (mouseTimeout.current) clearTimeout(mouseTimeout.current); // 2-4 기존 타임아웃 제거
            mouseTimeout.current = setTimeout(() => { // 2-5 2초 후 재생 버튼 숨김 처리
                if (playBtn) {
                    playBtn.classList.remove('show'); // 2-6 'show' 클래스 제거 (숨김)
                }
            }, 2000);
        };

        window.addEventListener('mousemove', handleMouseMove); // 2-7 마우스 움직임 이벤트 리스너 추가
        return () => window.removeEventListener('mousemove', handleMouseMove); // 2-8 언마운트 시 이벤트 리스너 정리
    }, []); // 2-9 컴포넌트가 마운트될 때 한 번만 실행

    // 기능 3: 비디오 재생/일시정지 토글
    const togglePlay = () => {
        const video = videoRef.current; // 3-1 참조된 비디오 요소 가져오기
        if (video) { // 3-2 비디오 요소가 존재하는지 확인
            if (isPlaying) { // 3-3 비디오가 재생 중인 경우
                video.pause(); // 3-4 비디오를 일시정지
            } else { // 3-5 비디오가 일시정지된 경우
                video.play(); // 3-6 비디오를 재생
            }
            setIsPlaying(!isPlaying); // 3-7 재생 상태를 반전
        }
    };

    // 컴포넌트 렌더링
    return (
        <div className="jouterBox" onClick={togglePlay}> {/* 4-1 페이지 컨테이너, 클릭 시 재생/일시정지 토글 */}
            <div className="jplayerBox"> {/* 4-2 비디오 플레이어 컨테이너 */}
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

                {/* 기능 4: 재생 버튼 */}
                <div
                    className="playBtnBox" // 5-1 재생 버튼 컨테이너
                    ref={playBtnRef} // 5-2 재생 버튼 참조 연결
                    onClick={(e) => {
                        e.stopPropagation(); // 5-3 부모 컨테이너 클릭 이벤트 방지
                        togglePlay(); // 5-4 버튼 클릭 시 재생/일시정지 토글
                    }}
                >
                    <div className="playBtn"> {/* 5-5 재생 버튼 내부 컨테이너 */}
                        <img
                            src={`${process.env.REACT_APP_IMG_SRC}/playbtn.png`} // 5-6 재생 버튼 이미지 URL
                            alt="Play Button" // 5-7 재생 버튼 이미지 대체 텍스트
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
