import { Link } from 'react-router-dom';
import { LogoIcon, ChatIcon, BellIcon, UserIcon } from '../icons';
import { Button, Badge } from '../common';
import { SearchBar } from './SearchBar';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

export const Header = () => {
  const { isLoggedIn, user } = useAuthStore();
  const { unreadCounts } = useChatStore();

  // 전체 읽지 않은 메시지 수 계산
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-content mx-auto px-20">
        <div className="flex items-center justify-between h-header">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <LogoIcon size={36} />
            <span className="text-xl font-bold text-primary">SSAFY Market</span>
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
                  <Button variant="primary" size="md">
                    글쓰기
                  </Button>
                </Link>

                {/* 채팅 버튼 */}
                <Link to="/chat">
                  <Button variant="secondary" size="md" className="relative">
                    채팅
                    {totalUnreadCount > 0 && <Badge count={totalUnreadCount} />}
                  </Button>
                </Link>

                {/* 마이페이지 버튼 */}
                <Link to="/mypage">
                  <Button variant="secondary" size="md">
                    마이페이지
                  </Button>
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
