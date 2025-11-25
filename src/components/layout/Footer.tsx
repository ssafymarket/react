import { Link } from 'react-router-dom';
import logo from '@/assets/icon_logo.svg';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-content mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 싸피마켓 + 문의하기 */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="싸피마켓" className="h-8" />
              <span className="text-xl font-bold text-gray-900">싸피마켓</span>
            </Link>
            <p className="text-sm text-gray-600 mb-6">
              싸피 구미캠퍼스 중고 직거래 플랫폼
            </p>

            {/* 문의하기 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">문의하기</h3>
              <p className="text-sm text-gray-600">
                문의사항은 각 반 자치회에게 문의해주세요
              </p>
            </div>
          </div>

          {/* 만든이 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">만든이</h3>
            <Link
              to="/team"
              className="text-sm text-primary hover:text-primary transition-colors underline inline-flex items-center gap-1"
            >
              Team Arfni
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>

          {/* 기여 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">기여한 사람들</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* 13기 학생회 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">13기 자치회</h4>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li>박기현</li>
                  <li>박재완</li>
                  <li>공연경</li>
                  <li>조경호</li>
                  <li>천지윤</li>
                </ul>
              </div>

              {/* 14기 학생회 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">14기 자치회</h4>
                <div className="grid grid-cols-2 gap-2">
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>조문희</li>
                    <li>이혜빈</li>
                    <li>박준영</li>
                    <li>민승환</li>
                    <li>박소연</li>
                    <li>김민재</li>
                  </ul>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>김도영</li>
                    <li>신영옥</li>
                    <li>김지호</li>
                    <li>김정희</li>
                    <li>김유빈</li>
                    <li>오우택</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
