import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Badge } from '../common';
import { SearchBar } from './SearchBar';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { getTotalUnreadCount } from '@/api/chat/chat.api';
import logo from '@/assets/icon_logo.svg';
import iconPen from '@/assets/icon_pen.svg';
import iconChat from '@/assets/icon_chat.svg';
import iconPerson from '@/assets/icon_person.svg';

export const Header = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn, user } = useAuthStore();
  const { totalUnreadCount, setTotalUnreadCount } = useChatStore();

  const isAdmin = user?.role === 'ROLE_ADMIN';

  // 전체 읽지 않은 메시지 수 조회 (30초마다 갱신 - 백업용)
  const { data: polledUnreadCount = 0 } = useQuery({
    queryKey: ['totalUnreadCount'],
    queryFn: getTotalUnreadCount,
    enabled: isLoggedIn,
    staleTime: 0, // 항상 최신 데이터로 간주
    refetchInterval: 30000, // 30초마다 갱신 (WebSocket 끊겼을 때 백업)
    refetchOnWindowFocus: true, // 창 포커스 시 갱신
  });

  // 폴링된 값을 스토어에 반영
  useEffect(() => {
    if (polledUnreadCount !== undefined) {
      setTotalUnreadCount(polledUnreadCount);
    }
  }, [polledUnreadCount, setTotalUnreadCount]);

  // Store 값이 변경되면 React Query 캐시도 업데이트 (양방향 동기화)
  useEffect(() => {
    queryClient.setQueryData(['totalUnreadCount'], totalUnreadCount);
  }, [totalUnreadCount, queryClient]);

  // WebSocket 구독은 WebSocketProvider에서 전역 관리
  // Header는 useChatStore의 totalUnreadCount를 실시간으로 표시
  // 폴링은 WebSocket 연결 실패 시 백업용으로 동작

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-20">
          <div className="flex items-center justify-between h-header">
            {/* 로고 */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="싸피마켓" className="h-8" />
              <span className="text-lg md:text-xl font-bold text-gray-900">싸피마켓</span>
            </Link>

            {/* 검색바 (데스크탑만) */}
            <div className="hidden lg:flex flex-1 mx-8">
              <SearchBar />
            </div>

            {/* 우측 버튼/아이콘 그룹 */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  {/* 데스크탑: 모든 버튼 표시 */}
                  <div className="hidden lg:flex items-center gap-3">
                    {/* 글쓰기 버튼 */}
                    <Link to="/products/new">
                      <Button variant="primary" size="md" className="flex items-center gap-2">
                        <img src={iconPen} alt="" className="w-5 h-5 brightness-0 invert" />
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
                    <Link to="/mypage">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <img src={iconPerson} alt="마이페이지" className="w-6 h-6" />
                      </button>
                    </Link>

                    {/* 승인관리 버튼 (관리자만) */}
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="secondary" size="md">
                          승인관리
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* 모바일: 채팅 아이콘 + 마이페이지 아이콘 + 관리 버튼 */}
                  <div className="flex lg:hidden items-center gap-2">
                    {/* 채팅 버튼 */}
                    <Link to="/chat">
                      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <img src={iconChat} alt="채팅" className="w-6 h-6" />
                        {totalUnreadCount > 0 && <Badge count={totalUnreadCount} />}
                      </button>
                    </Link>

                    {/* 마이페이지 버튼 */}
                    <Link to="/mypage">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <img src={iconPerson} alt="마이페이지" className="w-6 h-6" />
                      </button>
                    </Link>

                    {/* 관리 버튼 (관리자만) */}
                    {isAdmin && (
                      <Link to="/admin">
                        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                          관리
                        </button>
                      </Link>
                    )}
                  </div>
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
    </>
  );
};
