# React WebSocket 연동 가이드

## 개요

Spring Boot WebSocket 서버와 React 프론트엔드를 연동하는 가이드입니다.

**서버 주소**: `http://k13d201.p.ssafy.io:8083/ws`

---

## 1. 패키지 설치

```bash
npm install sockjs-client @stomp/stompjs
```

---

## 2. WebSocket 서비스 생성

`src/services/websocket.service.js`:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  // WebSocket 연결
  connect(onConnected, onError) {
    this.client = new Client({
      // SockJS를 통한 연결
      webSocketFactory: () => new SockJS('http://k13d201.p.ssafy.io:8083/ws'),

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
    });

    this.client.activate();
  }

  // 연결 해제
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket 연결 해제');
    }
  }

  // 채팅방 구독
  subscribeToRoom(roomId, callback) {
    if (!this.connected) {
      console.error('WebSocket 연결되지 않음');
      return null;
    }

    const subscription = this.client.subscribe(
      `/topic/room/${roomId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    console.log(`📢 채팅방 ${roomId} 구독`);
    return subscription;
  }

  // 메시지 전송
  sendMessage(roomId, content, imageUrl = null) {
    if (!this.connected) {
      console.error('WebSocket 연결되지 않음');
      return;
    }

    this.client.publish({
      destination: `/app/chat/send/${roomId}`,
      body: JSON.stringify({
        content: content,
        messageType: 'CHAT',
        imageUrl: imageUrl,
      }),
    });

    console.log('💬 메시지 전송:', content);
  }

  // 채팅방 입장
  enterRoom(roomId) {
    if (!this.connected) {
      console.error('WebSocket 연결되지 않음');
      return;
    }

    this.client.publish({
      destination: `/app/chat/enter/${roomId}`,
      body: JSON.stringify({}),
    });

    console.log(`🚪 채팅방 ${roomId} 입장`);
  }

  // 읽음 처리
  markAsRead(roomId) {
    if (!this.connected) {
      console.error('WebSocket 연결되지 않음');
      return;
    }

    this.client.publish({
      destination: `/app/chat/read/${roomId}`,
      body: JSON.stringify({}),
    });

    console.log(`✔️ 메시지 읽음 처리 (방 ${roomId})`);
  }

  // 연결 상태 확인
  isConnected() {
    return this.connected;
  }
}

// 싱글톤 인스턴스
export default new WebSocketService();
```

---

## 3. 채팅 컴포넌트 예시

```jsx
import { useEffect, useState } from 'react';
import websocketService from '../services/websocket.service';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 1. WebSocket 연결
    websocketService.connect(
      () => {
        // 연결 성공
        setConnected(true);

        // 2. 채팅방 구독
        websocketService.subscribeToRoom(roomId, (message) => {
          console.log('메시지 수신:', message);
          setMessages((prev) => [...prev, message]);
        });

        // 3. 입장 알림
        websocketService.enterRoom(roomId);
      },
      (error) => {
        // 연결 실패
        console.error('연결 실패:', error);
        setConnected(false);
        alert('WebSocket 연결 실패. 로그인 상태를 확인하세요.');
      }
    );

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      websocketService.disconnect();
    };
  }, [roomId]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!connected) {
      alert('WebSocket이 연결되지 않았습니다.');
      return;
    }

    websocketService.sendMessage(roomId, inputMessage);
    setInputMessage('');
  };

  // 읽음 처리
  const handleMarkAsRead = () => {
    websocketService.markAsRead(roomId);
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <h2>채팅방 #{roomId}</h2>
        <span style={{ color: connected ? 'green' : 'red' }}>
          {connected ? '🟢 연결됨' : '🔴 연결 끊김'}
        </span>
      </div>

      {/* 메시지 목록 */}
      <div style={{ border: '1px solid #ccc', height: 400, overflowY: 'auto', padding: 10 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <strong>{msg.senderName || msg.senderId}</strong>
            <span style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
            <div>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="이미지" style={{ maxWidth: 200 }} />
              )}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 입력 폼 */}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
          disabled={!connected}
          style={{ width: 300, padding: 8 }}
        />
        <button onClick={handleSendMessage} disabled={!connected}>
          전송
        </button>
        <button onClick={handleMarkAsRead} disabled={!connected}>
          읽음
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
```

---

## 4. 주요 엔드포인트

### 구독 (Subscribe)
- `/topic/room/{roomId}` - 채팅방 메시지 수신

### 발행 (Publish)
- `/app/chat/send/{roomId}` - 메시지 전송
- `/app/chat/enter/{roomId}` - 채팅방 입장
- `/app/chat/read/{roomId}` - 읽음 처리

---

## 5. 메시지 형식

### 서버 → 클라이언트 (수신)
```json
{
  "id": 123,
  "roomId": 1,
  "senderId": "2024001",
  "senderName": "홍길동",
  "content": "안녕하세요!",
  "messageType": "CHAT",
  "imageUrl": "https://example.com/image.jpg",
  "isRead": false,
  "createdAt": "2025-11-12T10:30:00"
}
```

### 클라이언트 → 서버 (전송)
```json
{
  "content": "안녕하세요!",
  "messageType": "CHAT",
  "imageUrl": null
}
```

### 메시지 타입
- `CHAT` - 일반 채팅 메시지
- `ENTER` - 입장 메시지

---

## 6. 중요 사항

### ⚠️ 인증 필수
- **반드시 로그인 후** WebSocket 연결
- 로그인하지 않으면 연결이 **거부**(400 에러)
- 브라우저가 자동으로 세션 쿠키 전송

### 로그인 확인 예시
```jsx
useEffect(() => {
  // 로그인 상태 확인
  const isLoggedIn = checkLoginStatus(); // 로그인 체크 함수

  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    navigate('/login');
    return;
  }

  // 로그인되어 있으면 WebSocket 연결
  websocketService.connect(onConnected, onError);
}, []);
```

### 🔄 자동 재연결
- 연결 끊김 시 **5초마다 자동 재연결** 시도
- 별도 처리 불필요

### 🧹 리소스 정리
- 컴포넌트 언마운트 시 반드시 `disconnect()` 호출
- 메모리 누수 방지

---

## 7. 환경 변수 설정

`.env`:
```
REACT_APP_WS_URL=http://k13d201.p.ssafy.io:8083/ws
```

`websocket.service.js`에서 사용:
```javascript
webSocketFactory: () => new SockJS(process.env.REACT_APP_WS_URL)
```

### 개발/프로덕션 분리
```javascript
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'https://k13d201.p.ssafy.io:8083/ws'  // wss:// (HTTPS)
  : 'http://localhost:8080/ws';             // ws:// (HTTP)
```

---

## 8. 트러블슈팅

### 🔴 연결 실패 (400 에러)
**원인**: 로그인하지 않음
**해결**: 로그인 후 연결

### 🔴 메시지 수신 안 됨
**원인**: 구독 안 됨
**해결**: `subscribeToRoom()` 호출 확인

### 🔴 CORS 에러
**원인**: 서버 설정 문제
**해결**: 서버에서 이미 `setAllowedOriginPatterns("*")` 설정됨 (문제 없음)

### 🔴 연결 후 바로 끊김
**원인**: 인증 세션 만료
**해결**: 재로그인

---

## 9. 테스트 방법

### Postman으로 테스트 불가
- Postman은 SockJS 미지원
- 브라우저에서만 정상 작동

### 브라우저 콘솔 확인
```javascript
// 개발자 도구 콘솔에서
console.log(websocketService.isConnected()); // true/false
```

---

## 10. 추가 기능 예시

### 이미지 전송
```javascript
// 1. 이미지 업로드 (REST API)
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { imageUrl } = await response.json();

// 2. WebSocket으로 이미지 URL 전송
websocketService.sendMessage(roomId, '사진을 보냈습니다.', imageUrl);
```

### 여러 채팅방 동시 구독
```javascript
const subscriptions = [];

// 여러 방 구독
[1, 2, 3].forEach(roomId => {
  const sub = websocketService.subscribeToRoom(roomId, handleMessage);
  subscriptions.push(sub);
});

// 정리
subscriptions.forEach(sub => sub.unsubscribe());
```

---

## 요약

1. **로그인 필수** - 세션 쿠키 필요
2. **SockJS 사용** - 일반 WebSocket이 아님
3. **자동 재연결** - 연결 끊김 시 자동 복구
4. **구독 필수** - `/topic/room/{roomId}` 구독해야 메시지 수신
5. **정리 필수** - 언마운트 시 `disconnect()` 호출
