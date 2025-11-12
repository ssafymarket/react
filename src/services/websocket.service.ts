import { Client } from '@stomp/stompjs';
import type { StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type MessageCallback = (message: any) => void;

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private subscriptions: Map<string, StompSubscription> = new Map();

  /**
   * WebSocket 연결
   */
  connect(onConnected?: () => void, onError?: (error: any) => void): void {
    if (this.client && this.connected) {
      console.log('이미 WebSocket에 연결되어 있습니다.');
      onConnected?.();
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://k13d201.p.ssafy.io:8084/ws', null, {
        withCredentials: true, // 세션 쿠키 포함
      }),

      reconnectDelay: 5000, // 재연결 간격 (5초)

      debug: (str) => {
        console.log('[STOMP]', str);
      },

      onConnect: () => {
        console.log('✅ WebSocket 연결 성공');
        this.connected = true;
        onConnected?.();
      },

      onStompError: (frame) => {
        console.error('❌ WebSocket 에러:', frame);
        this.connected = false;
        onError?.(frame);
      },

      onWebSocketClose: () => {
        console.log('🔌 WebSocket 연결 종료');
        this.connected = false;
      },

      onWebSocketError: (error) => {
        console.error('❌ WebSocket 연결 에러:', error);
        this.connected = false;
        onError?.(error);
      },
    });

    this.client.activate();
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.client) {
      // 모든 구독 취소
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // 클라이언트 비활성화
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket 연결 해제');
    }
  }

  /**
   * 채팅방 구독
   */
  subscribeToRoom(roomId: number, callback: MessageCallback): StompSubscription | null {
    if (!this.connected || !this.client) {
      console.error('WebSocket 연결되지 않음');
      return null;
    }

    const destination = `/topic/room/${roomId}`;
    
    // 이미 구독 중인지 확인
    if (this.subscriptions.has(destination)) {
      console.log(`이미 채팅방 ${roomId}를 구독 중입니다.`);
      return this.subscriptions.get(destination)!;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log(`📢 채팅방 ${roomId} 구독`);
    
    return subscription;
  }

  /**
   * 채팅방 구독 취소
   */
  unsubscribeFromRoom(roomId: number): void {
    const destination = `/topic/room/${roomId}`;
    const subscription = this.subscriptions.get(destination);
    
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`📢 채팅방 ${roomId} 구독 취소`);
    }
  }

  /**
   * 메시지 전송
   */
  sendMessage(roomId: number, content: string, messageType: 'CHAT' | 'ENTER' = 'CHAT'): void {
    if (!this.connected || !this.client) {
      console.error('WebSocket 연결되지 않음');
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    this.client.publish({
      destination: `/app/chat/send/${roomId}`,
      body: JSON.stringify({
        content: content,
        messageType: messageType,
      }),
    });

    console.log('💬 메시지 전송:', content);
  }

  /**
   * 채팅방 입장
   */
  enterRoom(roomId: number): void {
    if (!this.connected || !this.client) {
      console.error('WebSocket 연결되지 않음');
      return;
    }

    this.client.publish({
      destination: `/app/chat/enter/${roomId}`,
      body: JSON.stringify({}),
    });

    console.log(`🚪 채팅방 ${roomId} 입장`);
  }

  /**
   * 읽음 처리
   */
  markAsRead(roomId: number): void {
    if (!this.connected || !this.client) {
      console.error('WebSocket 연결되지 않음');
      return;
    }

    this.client.publish({
      destination: `/app/chat/read/${roomId}`,
      body: JSON.stringify({}),
    });

    console.log(`✔️ 메시지 읽음 처리 (방 ${roomId})`);
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();

export default websocketService;
