import { Link } from 'react-router-dom';
import logo from '@/assets/icon_logo.svg';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-content mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 싸피마켓 */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="싸피마켓" className="h-8" />
              <span className="text-xl font-bold text-gray-900">싸피마켓</span>
            </Link>
            <p className="text-sm text-gray-600">
              싸피 구미캠퍼스 중고 직거래 플랫폼
            </p>
          </div>

          {/* 문의하기 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">문의하기</h3>
            <p className="text-sm text-gray-600">
              문의사항은 각 반 반장 및 CA에게 문의해주세요.
            </p>
          </div>

          {/* 만든이 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">만든이</h3>
            <Link
              to="/team"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Team Arfni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
