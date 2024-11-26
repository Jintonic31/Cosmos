import React, { useState, useEffect, useRef } from 'react';
import '../Style/JoinAuction.css';
import { useNavigate } from 'react-router-dom';

export default function JoinAuction() {

    const navi = useNavigate();

    // 비디오 로드 완료 처리
    const handleVideoLoad = () => {
        console.log('비디오 로드 완료');
    };


  return (
    <div className="jouterBox">
        <div className="jplayerBox">
            <video 
                className='jvideoPlayer' 
                autoPlay
                loop
                muted
                onLoadedData={handleVideoLoad} // 비디오 로딩 완료 시 처리
            >
                <source src={`${process.env.REACT_APP_VIDEO_SRC}/2_video.mp4`} type="video/mp4" />
                {/* 지원되지 않는 브라우저를 위한 대체 텍스트 */}
                이 브라우저는 안됨~
            </video>
        </div>

        </div>
  )
}
