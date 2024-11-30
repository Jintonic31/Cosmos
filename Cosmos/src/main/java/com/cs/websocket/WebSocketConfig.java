package com.cs.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer{

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 사용자 정의 WebSocket 핸들러를 사용
        registry.addHandler(new MyWebSocketHandler(), "/ws") // WebSocket 엔드포인트
                .setAllowedOrigins("*"); // 모든 origin 허용
    }

}
