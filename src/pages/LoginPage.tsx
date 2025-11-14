import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import logo from '@/assets/icon_logo.svg';
import { login as loginApi } from '@/api/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 기본 유효성 검사
    if (!studentId || !password) {
      setError('학번과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 로그인 API 호출 (세션 쿠키 자동 설정됨)
      const response = await loginApi({ studentId, password });

      if (response.success && response.userId) {
        // 세션 쿠키가 설정되었으므로, 기본 사용자 정보만 저장
        const user = {
          studentId: response.userId,
          name: '', // 추후 프로필 API로 조회 가능
          className: '', // 추후 프로필 API로 조회 가능
          role: (response.roles[0] as 'ROLE_USER' | 'ROLE_ADMIN') || 'ROLE_USER',
        };

        // Zustand 스토어에 사용자 정보 저장 (토큰은 제거됨)
        login(user);
        navigate('/');
      } else {
        setError(response.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      // 에러 메시지 처리
      console.error('로그인 에러:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || '로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더는 Layout과 동일하게 유지 */}
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
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-16">
          <img src={logo} alt="싸피마켓" className="h-10" />
          <span className="text-2xl font-bold text-gray-900">싸피마켓</span>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
          {/* 학번 입력 - 라벨 없음 */}
          <input
            id="studentId"
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            maxLength={7}
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 비밀번호 입력 - 라벨 없음 */}
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={30}
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* 버튼 영역 - 나란히 배치 */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              회원가입
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
