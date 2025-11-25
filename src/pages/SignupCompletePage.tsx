import { useNavigate, Link } from 'react-router-dom';
import logo from '@/assets/icon_logo.svg';

export const SignupCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 h-16 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="싸피마켓" className="h-8" />
            <span className="text-xl font-bold text-gray-900">싸피마켓</span>
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 - 중앙 정렬 */}
      <main className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* 완료 메시지 */}
        <div className="w-full max-w-xl text-center space-y-6">
          {/* 체크 아이콘과 제목 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">
              가입 신청 완료
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            24시간 내에 가입 승인이 완료되면 로그인하실 수 있습니다.
    
          </p>
          <span className="text-lg text-gray-600">
            문의사항은 각 반 자치회에게 문의해주세요.
          </span>


          {/* 확인 버튼 */}
          <button
            onClick={() => navigate('/')}
            className="w-full max-w-md mx-auto px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
          >
            확인
          </button>
        </div>
      </main>
    </div>
  );
};
