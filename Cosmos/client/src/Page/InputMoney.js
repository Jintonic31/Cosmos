import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Style/InputMoney.css';

function InputMoney() {

  const navi = useNavigate();
  const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
  const ws = useRef(null); // WebSocket 인스턴스
  const springUrl = process.env.REACT_APP_SPRING_SRC;
  const [showReturnMessage, setShowReturnMessage] = useState(false); // 텍스트 표시 상태
  const inactivityTimeoutRef = useRef(null); // 비활성 타이머 참조
  const returnTimeoutRef = useRef(null); // 이동 타이머 참조
  const [userActive, setUserActive] = useState(false); // 사용자 활동 상태
  const [selectedNumbers, setSelectedNumbers] = useState([0, 0, 0]); // 각 휠의 상태
  const touchStartY = useRef({});
  const accumulatedDelta = useRef({});


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

  
  const handleTouchStart = (e, id) => {
    touchStartY.current[id] = e.touches[0].clientY;
    resetInactivityTimer(); // 스와이프 시작 시 타이머 리셋
  };

  const handleTouchMove = (e, id) => {
    if (touchStartY.current[id] !== null) {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current[id] - touchEndY;

      accumulatedDelta.current[id] = (accumulatedDelta.current[id] || 0) + deltaY;
      touchStartY.current[id] = touchEndY;

      if (Math.abs(accumulatedDelta.current[id]) >= 50) {
        setSelectedNumbers((prev) => {
          const newNumbers = [...prev];
          if (accumulatedDelta.current[id] > 0) {
            // 위로 스와이프
            newNumbers[id] = newNumbers[id] < 9 ? newNumbers[id] + 1 : 0;
          } else {
            // 아래로 스와이프
            newNumbers[id] = newNumbers[id] > 0 ? newNumbers[id] - 1 : 9;
          }
          return newNumbers;
        });
        accumulatedDelta.current[id] = 0;
      }
    }
  };

  const handleTouchEnd = (id) => {
    touchStartY.current[id] = null;
    accumulatedDelta.current[id] = 0;
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
      setShowReturnMessage(true); // 15초 후 텍스트 표시

      // 5초 후 이동
      returnTimeoutRef.current = setTimeout(() => {
          
          // 조건 1
          if (!userActive) {
              navi('/substart'); // /substart로 이동
          }

          //  조건 2: WebSocket을 통해 다른 브라우저를 '/'로 이동
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              const message = JSON.stringify({ action: 'navigate', url: '/' });
              ws.current.send(message);
          }
      // 이동 안내 멘트 출력 후 페이지 이동 전 대기 시간 (5초)  
      }, 5000);

    // 사용자 반응이 없을 경우 페이지 이동 예정 안내 멘트 출력까지 대기 시간 (15초)
    }, 15000);

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



  const handleLoadingClick = () => {
    // 현재 선택된 값을 읽기
    const selectedValues = parseInt(selectedNumbers.join(''), 10);

    // 콘솔에 값 출력
    // console.log(`서브밋 될 값 #1 : ${selectedValues}`);
    // console.log('서브밋 될 값 #2 : ', selectedValues);    

    // DB로 데이터 전송
    axios.post(`${springUrl}/api/price/insertmoney`, { price: selectedValues })
      .then((result) => {
        //console.log('서버전송 url : ' + springUrl)
        console.log('가격 전송 완료');
        navi('/loadingvideo');  // iPad에서 /loadingvideo로 이동
      })
      .catch((error) => {
        console.error('가격 전송 실패:', error);
      });


      // iMac에 WebSocket 메시지 전송
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ action: 'navigate', url: '/loadingauction' });
        ws.current.send(message);
    }
  };

  // 각 휠에 대한 숫자 목록 생성
  const numberLists = selectedNumbers.map((selectedNumber) =>
    Array.from({ length: 11 }, (_, i) => (selectedNumber + i - 5 + 10) % 10)
  );


  
  return (
    <div className='iouterBox'>
      {/* <img
        src={`${process.env.REACT_APP_IMG_SRC}/scrollbackground.png`}
        alt='scrollimg'
        className='scrollbackground'
      /> */}

      <div
          className={`ireturnMessage ${showReturnMessage ? 'show' : ''}`}
      >
          5초 뒤 처음 화면으로 돌아갑니다.
      </div>


      <div className='nownumber'>
        (BIDDING PRICE)
      </div>
      <img
        src={`${process.env.REACT_APP_IMG_SRC}/redarrow.png`}
        alt='redarrowimg'
        className='redarrowimg'
      />


      <div className='igohomeBtnBox' onClick={() => navi('/substart')}>
        ● HOME
      </div>



	<div className='igohomegraybox'></div>


      {numberLists.map((numberList, index) => (
        <div
          key={index}
          className="scroll-wheel-container"
          id={`scrollcontainer${index}`}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={(e) => handleTouchMove(e, index)}
          onTouchEnd={() => handleTouchEnd(index)}
        >
          <div className="scroll-wheel">
            {numberList.map((num, idx) => (
              <div
                key={idx}
                className={`number-item ${idx === 5 ? 'selected' : ''}`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
      className='scroll-wheel-container2'
      id='scroll-wheel-container0'>
        ,
      </div>
      <div className='scroll-wheel-container2' id='scroll-wheel-container1'>
        0
      </div>
      <div className='scroll-wheel-container2' id='scroll-wheel-container2'>
        0
      </div>
      <div className='scroll-wheel-container2' id='scroll-wheel-container3'>
        0
      </div>


      <div className='submitBtnWrap'>
        <img src={`${process.env.REACT_APP_IMG_SRC}/submitbtn.png`} alt='submitBtn' className='submitBtn' onClick={handleLoadingClick}/>
        <div className='submitWord'  onClick={handleLoadingClick}>SUBMIT</div>
      </div>






    </div>
  );
}

export default InputMoney;