package com.cs.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

// Spring이 이 클래스를 Config 파일로 인식하고 자동으로 실행하도록 만드는 것
//	ㄴ WebSocketConfig 클래스가 웹소켓 관련 설정을 담은 클래스임을 Spring이 알도록 하는 것
@Configuration

// Spring에서 웹소켓을 활성화하도록 하는 어노테이션
//	ㄴ 얘가 있어야 Spring이 웹소켓 관련 기능을 활성화하고 관리 가능
@EnableWebSocket

// WebSocketConfigurer : 어떤 경로에서 웹소켓을 사용할지, 어떤 핸들러를 연결할지 등을 설정할 수 있게 해주는 인터페이스
//		ㄴ 이 인터페이스 안에 registerWebSocketHandlers() 라는 메서드 단 하나만 존재하고 구현된 내용이 없음
//		ㄴ 즉 이 메서드를 오버라이드(재정의)해서 웹소켓 통신을 어떻게 할지 튜닝하는 것
public class WebSocketConfig implements WebSocketConfigurer{

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        
		// 웹소켓 엔드포인트를 "/ws"로 설정
		//	ㄴ 클라이언트는 웹소켓 통신을 위해 [ ws://서버주소:포트/ws ] 로 접속
		//	ㄴ "ws://" 는 웹소켓 프로토콜로 비보안(ws://)과 보안(wss://)이 있음
		//	ㄴ 통신을 하려는 클라이언트가 ws://서버주소:포트/ws 로 접속하여 실시간 통신을 함
		//		ㄴ 여기서 말하는 접속은 서버에서 활성화시켜둔 웹소켓과 서버에서 지정한 엔드포인트를 가지고 프론트에서 접속 코드를 추가
        registry.addHandler(new MyWebSocketHandler(), "/ws")
                .setAllowedOrigins("*"); // 모든 origin 허용
    }

}
