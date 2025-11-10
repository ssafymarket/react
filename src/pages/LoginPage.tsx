import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import logo from '@/assets/icon_logo.svg';

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
      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/auth/login', { studentId, password });

      // 임시 로그인 처리
      const mockUser = {
        studentId,
        name: '홍길동',
        class: '13기' as const,
        role: 'ROLE_USER' as const,
      };
      const mockToken = 'test-token-' + studentId;

      login(mockUser, mockToken);
      navigate('/');
    } catch (err) {
      setError('로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더는 Layout과 동일하게 유지 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-20 h-16 flex items-center justify-between gap-8">
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
