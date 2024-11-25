import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Style/InputMoney.css';

function InputMoney() {

  const navi = useNavigate();
  const springUrl = process.env.REACT_APP_SPRING_SRC;
  // console.log('서버 경로 : ', springUrl);
  const [selectedNumbers, setSelectedNumbers] = useState([0, 0, 0]); // 각 휠의 상태
  const touchStartY = useRef({});
  const accumulatedDelta = useRef({});

  const handleTouchStart = (e, id) => {
    touchStartY.current[id] = e.touches[0].clientY;
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
  };


  const onSubmit = () => {
    // 현재 선택된 값을 읽기
    const selectedValues = parseInt(selectedNumbers.join(''), 10);

    // 콘솔에 값 출력
    // console.log(`서브밋 될 값 #1 : ${selectedValues}`);
    //console.log('서브밋 될 값 #2 : ', selectedValues);    

    // DB로 데이터 전송
    axios.post(`${springUrl}/api/price/insertmoney`, { price: selectedValues })
      .then((result) => {
        console.log('가격 전송 완료');
        navi('/loadingvideo'); // 로딩 화면으로 이동
      })
      .catch((error) => {
        console.error('가격 전송 실패:', error);
      });
  };

  // 각 휠에 대한 숫자 목록 생성
  const numberLists = selectedNumbers.map((selectedNumber) =>
    Array.from({ length: 11 }, (_, i) => (selectedNumber + i - 5 + 10) % 10)
  );

  return (
    <div className='iouterBox'>
      <img
        src={`${process.env.REACT_APP_IMG_SRC}/scrollbackground.png`}
        alt='scrollimg'
        className='scrollbackground'
      />

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


      <div className='submitBtnWrap'>
        <div className='submitBtn'  onClick={onSubmit}></div>
      </div>


    </div>
  );
}

export default InputMoney;
