import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import iconPen from '@/assets/icon_pen.svg';
import iconPerson from '@/assets/icon_person.svg';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <>
      {/* 오버레이 배경 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">메뉴</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메뉴 항목 */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* 글쓰기 */}
              <Link
                to="/products/new"
                onClick={onClose}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={iconPen} alt="" className="w-5 h-5" />
                <span className="text-base font-medium text-gray-900">글쓰기</span>
              </Link>

              {/* 마이페이지 */}
              <Link
                to="/mypage"
                onClick={onClose}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={iconPerson} alt="" className="w-5 h-5" />
                <span className="text-base font-medium text-gray-900">마이페이지</span>
              </Link>

              {/* 관리 (관리자만) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-base font-medium text-gray-900">관리</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
