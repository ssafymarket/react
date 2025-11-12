import { Link, useLocation } from 'react-router-dom';
import iconPen from '@/assets/icon_pen.svg';

export const FloatingWriteButton = () => {
  const location = useLocation();

  // 채팅 페이지에서는 버튼 숨김
  if (location.pathname.startsWith('/chat')) {
    return null;
  }

  return (
    <Link
      to="/products/new"
      className="lg:hidden fixed bottom-20 right-4 md:right-8 z-40 w-14 h-14 bg-primary hover:bg-primary-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
    >
      <img src={iconPen} alt="글쓰기" className="w-6 h-6 brightness-0 invert" />
    </Link>
  );
};
