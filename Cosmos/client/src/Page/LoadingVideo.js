import React, {  useState, useEffect, useRef  } from 'react';
import Slider from 'react-slick';
import axios from 'axios'
import '../Style/LoadingVideo.css';
import { useNavigate } from 'react-router-dom';

function LoadingVideo() {
    const navi = useNavigate();
    const reactUrl = `${process.env.REACT_APP_MAIN_SRC}substart`;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const springUrl = process.env.REACT_APP_SPRING_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const [autoplaySpeed, setAutoplaySpeed] = useState(6005);
    const inactivityTimeoutRef = useRef(null); // 비활성 타이머 참조
    const returnTimeoutRef = useRef(null); // 이동 타이머 참조
    const [showReturnMessage, setShowReturnMessage] = useState(false); // 텍스트 표시 상태
    const [userActive, setUserActive] = useState(false); // 사용자가 입력했는지 상태 저장
    const [oneList, setOneList] = useState([]);


    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get(`${springUrl}/api/price/getonelist`);
                
                setOneList(result.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [springUrl]);


    function addNineHours(utcDate) {
        const date = new Date(utcDate); // UTC 시간을 Date 객체로 변환
        date.setHours(date.getHours() + 9); // 9시간 추가
        return date; // 변환된 Date 객체 반환
    }




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
          setShowReturnMessage(true); // 18초 후 텍스트 표시
  
          // 5초 후 이동
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
            // 이동 안내 멘트 출력 후 페이지 이동 전 대기 시간 (5초) 
            }, 5000);

        // 사용자 반응이 없을 경우 페이지 이동 예정 안내 멘트 출력까지 대기 시간 (18초)
        }, 18000);
  
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
                        <source src={`${process.env.REACT_APP_IMG_SRC}/3_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 성공 이미지 슬라이드 */}
                <div className="lsuccessBox">
                    <div
                        className={`lreturnMessage ${showReturnMessage ? 'show' : ''}`}
                    >
                        5초 뒤 처음 화면으로 돌아갑니다.
                    </div>

                    <img src={`${process.env.REACT_APP_IMG_SRC}/done2.png`} alt="Success" />

                    <div className='lsuccessResultBox'>
                        {
                            (oneList) ? (
                                oneList
                                    .map((list, idx) => {
                                        return (
                                            <div className='linfoGuest'>

                                                <div className='linfodate'>
                                                    {list.indate.substring(0, 4)}/{list.indate.substring(5, 7)}/{list.indate.substring(8, 10)}
                                                </div>

                                                <div className='linfoguestnum'>
                                                    GUEST&nbsp;&nbsp;{list.seq}
                                                </div>

                                                
                                            </div>
                                        )
                                    })
                            ) : (null)
                        }

                        {
                            (oneList) ? (
                                oneList
                                    .map((list, idx) => {

                                        // 9시간 더한 시간을 가져오기
                                        const adjustedDate = addNineHours(list.indate); // Date 객체
                                        console.log('9시간 더한 시간 : ' + adjustedDate);

                                        // 24시간 형식으로 시간만 가져오기
                                        const formattedTime = adjustedDate.toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hourCycle: 'h23' // 24시간 형식
                                        });


                                        return (
                                            <div className='linfoPrice'>
                                                
                                                <div className='linfoTime'>
                                                    KOR&nbsp;{formattedTime}
                                                </div>

                                                <div className='linfooneprice'>
                                                    $&nbsp;{list.price},000
                                                </div>

                                                
                                            </div>
                                        )
                                    })
                            ) : (null)
                        }


                    </div>

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