import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import websocketService from '@/services/websocket.service';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';

interface WebSocketContextType {
  connected: boolean;
  setActiveRoomId: (roomId: number | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { isLoggedIn, user } = useAuthStore();
  const { setTotalUnreadCount } = useChatStore();
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);

  const handleSetActiveRoomId = useCallback((roomId: number | null) => {
    setActiveRoomId(roomId);
  }, []);

  // WebSocket 연결 및 전역 구독
  useEffect(() => {
    if (!isLoggedIn) {
      // 로그아웃 시 연결 해제
      if (connected) {
        websocketService.disconnect();
        setConnected(false);
      }
      return;
    }

    // WebSocket 연결
    websocketService.connect(
      () => {
        setConnected(true);

        // 전역 알림 구독
        websocketService.subscribeToNotifications((notification) => {
          const isActiveRoom = notification.roomId === activeRoomId;

          if (isActiveRoom) {
            queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
            return;
          }

          if (notification.totalUnreadCount !== undefined) {
            setTotalUnreadCount(notification.totalUnreadCount);
            queryClient.setQueryData(['totalUnreadCount'], notification.totalUnreadCount);
          }

          queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
        });

        // 읽음 알림 구독
        websocketService.subscribeToReadNotifications((readNotification) => {
          if (readNotification.totalUnreadCount !== undefined) {
            setTotalUnreadCount(readNotification.totalUnreadCount);
            queryClient.setQueryData(['totalUnreadCount'], readNotification.totalUnreadCount);
          }

          queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
        });
      },
      () => {
        setConnected(false);
      }
    );

    // cleanup 함수: 컴포넌트 언마운트 시에는 연결 유지 (로그아웃 시에만 해제)
    return () => {
      // 언마운트 시에는 구독만 취소하고 연결은 유지
      // 실제 연결 해제는 로그아웃 시에만 발생
    };
  }, [isLoggedIn, queryClient, setTotalUnreadCount, activeRoomId]);

  return (
    <WebSocketContext.Provider value={{ connected, setActiveRoomId: handleSetActiveRoomId }}>
      {children}
    </WebSocketContext.Provider>
  );
};
