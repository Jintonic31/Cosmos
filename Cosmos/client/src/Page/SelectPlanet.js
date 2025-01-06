import React, { useState, useEffect, useRef } from 'react';
import '../Style/SelectPlanet.css';
import { useNavigate } from 'react-router-dom';

function SelectPlanet() {
    const navi = useNavigate();
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const reactUrl = `${process.env.REACT_APP_MAIN_SRC}substart`;
    const ws = useRef(null); // WebSocket 인스턴스
    const inactivityTimeoutRef = useRef(null); // 비활성 타이머 참조
    const returnTimeoutRef = useRef(null); // 이동 타이머 참조
    const [showReturnMessage, setShowReturnMessage] = useState(false); // 텍스트 표시 상태
    const [userActive, setUserActive] = useState(false); // 사용자가 입력했는지 상태 저장
    const touchStartX = useRef(0); // 터치 시작 X 좌표
    const [currentPosition, setCurrentPosition] = useState(0); // 현재 스와이프 위치 (인덱스)
    const [offset, setOffset] = useState(0); // 터치에 따라 실시간으로 이동하는 오프셋
    const planetWidth = 450; // .planetWrap의 고정 너비
    const planetCount = 6; // 총 행성 이미지 개수



    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX; // 터치 시작 좌표 기록
      resetInactivityTimer(); // 스와이프 시작 시 타이머 리셋
    };

    const handleTouchMove = (e) => {
        const currentTouchX = e.touches[0].clientX;
        const deltaX = currentTouchX - touchStartX.current;

        // 터치 움직임에 따라 오프셋 실시간 업데이트
        setOffset(deltaX);
    };

    const handleTouchEnd = () => {
        if (Math.abs(offset) > planetWidth / 4) { // 이동 거리가 기준 이상인 경우
            if (offset > 0 && currentPosition > 0) {
                setCurrentPosition((prev) => prev - 1); // 이전 행성으로 이동
            } else if (offset < 0 && currentPosition < planetCount - 1) {
                setCurrentPosition((prev) => prev + 1); // 다음 행성으로 이동
            }
        }

        setOffset(0); // 오프셋 초기화
        resetInactivityTimer(); // 스와이프 종료 시 타이머 리셋
    };


    // 비활성 타이머 리셋 함수
    const resetInactivityTimer = () => {
      if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current); // 기존 타이머 제거
      }

      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current); // 이동 타이머 제거
      }

      setShowReturnMessage(false); // 텍스트 숨기기
      setUserActive(true); // 사용자가 활성화된 상태로 설정

      inactivityTimeoutRef.current = setTimeout(() => {
        setUserActive(false); // 입력이 없음을 상태에 반영
        setShowReturnMessage(true); // 10초 후 텍스트 표시

        // 3초 후 이동
        returnTimeoutRef.current = setTimeout(() => {
            
            // 조건 1
            if (!userActive) {
                navi('/substart'); // /substart로 이동
            }

            // 조건 2: WebSocket을 통해 다른 브라우저를 '/'로 이동
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                const message = JSON.stringify({ action: 'navigate', url: '/' });
                ws.current.send(message);
            }

        }, 3000);
      }, 10000);

    };

  // 사용자 입력 이벤트를 감지하여 타이머 리셋
  useEffect(() => {
    const handleUserActivity = () => resetInactivityTimer();

    // 마우스 클릭 및 키보드 입력 이벤트 리스너 등록
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // 초기 타이머 설정
    resetInactivityTimer();

    // 컴포넌트 언마운트 시 이벤트 리스너 및 타이머 제거
    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
      }
      if (returnTimeoutRef.current) {
          clearTimeout(returnTimeoutRef.current);
      }
  };
  }, [navi]);


    // 기능 1: /selectplanet 경로에서 페이지 새로고침 시 홈페이지로 리다이렉션
    useEffect(() => {
      const currentPath = window.location.pathname; // 1-7 현재 URL 경로 가져오기
      const isPageReloaded = window.performance?.navigation?.type === 1; // 1-8 페이지가 새로고침되었는지 확인

      if (currentPath === '/selectplanet' && isPageReloaded) { // 1-9 /selectplanet 새로고침 시에만 리다이렉션
          window.location.href = `${reactUrl}`; // 1-10 홈페이지로 리다이렉션 수행
      }

      // WebSocket 네비게이션 플래그 초기화
      sessionStorage.removeItem('websocket-navigation');


  }, [reactUrl]); // 1-11 컴포넌트가 마운트될 때 한 번만

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


    return (
      <div className="souterBox">

        <img src={`${process.env.REACT_APP_IMG_SRC}/selectback.png`} alt="wjoin" className='selectBackimg'/>

        <div
            className={`returnMessage ${showReturnMessage ? 'show' : ''}`}
        >
            3초 뒤 처음 화면으로 돌아갑니다.
        </div>


        <div
          className="planetBox"
          style={{
              transform: `translateX(calc(-${currentPosition * planetWidth}px + ${offset}px))`,
              transition: offset === 0 ? 'transform 0.5s ease' : 'none', // 터치 종료 시에만 부드러운 애니메이션
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className='planetWrap'></div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet1.png`} alt='planet1' className="planetimg" onClick={handleJoinClick}/>
          </div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet2.png`} alt='planet1' className="planetimg" />
          </div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet3.png`} alt='planet1' className="planetimg" onClick={handleJoinClick} />
          </div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet4.png`} alt='planet1' className="planetimg" onClick={handleJoinClick} />
          </div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet5.png`} alt='planet1' className="planetimg" />
          </div>
          <div className='planetWrap'>
            <img src={`${process.env.REACT_APP_IMG_SRC}/planet6.png`} alt='planet1' className="planetimg" />
          </div>
        </div>

        <div className='goHomeBtn' onClick={() => navi('/substart')}></div>
  
        
      </div>
  );
}

export default SelectPlanet;

