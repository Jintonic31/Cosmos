import React, {  useState, useEffect, useRef  } from 'react';
import Slider from 'react-slick';
import axios from 'axios'
import '../Style/LoadingAuction.css';
import { useNavigate } from 'react-router-dom';


function LoadingAuction() {

    const navi = useNavigate();
    const reactUrl = process.env.REACT_APP_MAIN_SRC;
    const socketUrl = process.env.REACT_APP_WEBSOCKET_SRC;
    const springUrl = process.env.REACT_APP_SPRING_SRC;
    const ws = useRef(null); // WebSocket 인스턴스
    const [autoplaySpeed, setAutoplaySpeed] = useState(6005);
    const [priceList, setPriceList] = useState([]);



    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get(`${springUrl}/api/price/getpricelist`);
                const data = result.data;

                // 데이터가 40개 미만인 경우 대체 데이터 추가
                if (data.length < 48) {
                    const fillerCount = 48 - data.length;
                    const fillerData = Array.from({ length: fillerCount }, () => ({
                        indate: "?#-$%-;@ ??:&*", // 수정: 대체 텍스트 정의
                        // indate: "?#/ $%/ ;@ ??:&*",
                        seq: "---",
                        price: "000",
                    }));
                    setPriceList([...data, ...fillerData]);
                } else {
                    setPriceList(data);
                }
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

    

    // 데이터를 8개씩 그룹화하여 6줄 생성
    const groupedData = React.useMemo(() => {
        const extendedData = priceList.concat(priceList); // 데이터를 복제하여 자연스러운 루프 구현
        return Array.from({ length: 6 }, (_, idx) =>
            extendedData.slice(idx * 8, (idx + 1) * 8) // 각 라인의 데이터 그룹화
        );
    }, [priceList]); // priceList가 변경될 때마다 groupedData를 재계산



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
                        <source src={`${process.env.REACT_APP_IMG_SRC}/3_video.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 두 번째 슬라이드: 6줄의 aresultline */}
                <div className="laresultBox">
                    {groupedData.map((group, lineIdx) => (
                        <div className={`aresultline${lineIdx + 1}`} key={lineIdx}>
                            {group.map((list, idx) => {
                                // 추가: 인덱스 계산에 따른 스타일 설정
                                const backgroundStyles = [
                                    { backgroundColor: "#1B1B1B", color: "#FFFFFF" },
                                    { backgroundColor: "#FF0000", color: "#FFFFFF" },
                                    { backgroundColor: "#FFFFFF", color: "#FF0000" },
                                    { backgroundColor: "#BFBFBF", color: "#FF0000" },
                                ];
                                const style =
                                    backgroundStyles[(lineIdx * 8 + idx) % 4]; // 동적 스타일



                                // 날짜 유효성 검사
                                let formattedTime = "??:&*";
                                if (!isNaN(Date.parse(list.indate))) {
                                    const adjustedDate = addNineHours(list.indate);
                                    formattedTime = adjustedDate.toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hourCycle: 'h23', // 24시간 형식
                                    });
                                }


                                return (
                                    <div
                                        className="resultbox"
                                        id={`resultbox${lineIdx * 8 + idx}`}
                                        key={idx}
                                        style={style} // 추가: 동적 스타일 적용
                                    >
                                        <div className="resultInfo">
                                            <div className="infoDateWrap">
                                                <div className="infoDate">
                                                    {/* 수정된 대체 텍스트 처리 */}
                                                    {list.indate.split(" ")[0].replace(/-/g, "/") || "?#/$%/;@"}
                                                </div>
                                                <div className="infoTime">
                                                    {/* 수정된 대체 텍스트 처리 */}
                                                    KOR&nbsp;{formattedTime || "??:&*"}
                                                </div>
                                            </div>
                                            <div className="infoGuestWrap">
                                                <div className="infoGuest">
                                                    GUEST&nbsp;&nbsp;{list.seq || "---"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="resultPrice">
                                            <div className="infoprice">${list.price || "000"},000</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </Slider>
        </div>
    )
}

export default LoadingAuction

