import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Badge } from '../common';
import { SearchBar } from './SearchBar';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { getTotalUnreadCount } from '@/api/chat/chat.api';
import websocketService from '@/services/websocket.service';
import logo from '@/assets/icon_logo.svg';
import iconPen from '@/assets/icon_pen.svg';
import iconChat from '@/assets/icon_chat.svg';
import iconPerson from '@/assets/icon_person.svg';

export const Header = () => {
  const { isLoggedIn, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { totalUnreadCount, setTotalUnreadCount } = useChatStore();

  // 전체 읽지 않은 메시지 수 조회 (30초마다 갱신 - 백업용)
  const { data: polledUnreadCount = 0 } = useQuery({
    queryKey: ['totalUnreadCount'],
    queryFn: getTotalUnreadCount,
    enabled: isLoggedIn,
    refetchInterval: 30000, // 30초마다 갱신 (WebSocket 끊겼을 때 백업)
    refetchOnWindowFocus: true, // 창 포커스 시 갱신
  });

  // 폴링된 값을 스토어에 반영
  useEffect(() => {
    if (polledUnreadCount !== undefined) {
      setTotalUnreadCount(polledUnreadCount);
    }
  }, [polledUnreadCount, setTotalUnreadCount]);

  // WebSocket 실시간 알림 구독
  useEffect(() => {
    if (!isLoggedIn) return;

    // WebSocket 연결
    websocketService.connect(
      () => {
        console.log('[Header] WebSocket 연결 성공');

        // 전역 알림 구독
        websocketService.subscribeToNotifications((notification) => {
          console.log('[Header] 실시간 알림 수신:', notification);

          // totalUnreadCount 실시간 업데이트
          if (notification.totalUnreadCount !== undefined) {
            setTotalUnreadCount(notification.totalUnreadCount);

            // React Query 캐시도 업데이트
            queryClient.setQueryData(['totalUnreadCount'], notification.totalUnreadCount);
          }
        });
      },
      (error) => {
        console.error('[Header] WebSocket 연결 실패:', error);
      }
    );

    return () => {
      // 컴포넌트 언마운트 시 구독 취소 (연결은 유지)
      websocketService.unsubscribeFromNotifications();
    };
  }, [isLoggedIn, queryClient, setTotalUnreadCount]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-content mx-auto px-20">
        <div className="flex items-center justify-between h-header">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="싸피마켓" className="h-8" />
            <span className="text-xl font-bold text-gray-900">싸피마켓</span>
          </Link>

          {/* 검색바 */}
          <div className="flex-1 mx-8">
            <SearchBar />
          </div>

          {/* 우측 버튼/아이콘 그룹 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <>
                {/* 글쓰기 버튼 */}
                <Link to="/products/new">
                  <Button variant="primary" size="md" className="flex items-center gap-2">
                    <img src={iconPen} alt="" className="w-5 h-5" />
                    글쓰기
                  </Button>
                </Link>

                {/* 채팅 버튼 */}
                <Link to="/chat">
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <img src={iconChat} alt="채팅" className="w-6 h-6" />
                    {totalUnreadCount > 0 && <Badge count={totalUnreadCount} />}
                  </button>
                </Link>

                {/* 마이페이지 버튼 */}
                <Link to={isLoggedIn ? "/mypage" : "/login"}>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <img src={iconPerson} alt="마이페이지" className="w-6 h-6" />
                  </button>
                </Link>

                {/* 설정 버튼 (관리자 페이지) - 나중에 user.role === 'ADMIN' 조건 추가 */}
                <Link to="/admin">
                  <Button variant="secondary" size="md">
                    설정
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="md">
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
