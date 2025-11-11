import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '@/assets/icon_logo.svg';
import { signup } from '@/api/auth';

export const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    class: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 기본 유효성 검사
    if (!formData.studentId || !formData.name || !formData.password || !formData.passwordConfirm) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 학번 형식 검사 (7자리 숫자)
    if (!/^\d{7}$/.test(formData.studentId)) {
      setError('학번은 7자리 숫자여야 합니다.');
      return;
    }

    // 비밀번호 일치 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      // 회원가입 API 호출
      await signup({
        studentId: formData.studentId,
        name: formData.name,
        class: formData.class,
        password: formData.password,
      });

      // 회원가입 성공 후 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      // 에러 메시지 처리
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-20 h-16 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="싸피마켓" className="h-8" />
            <span className="text-xl font-bold text-gray-900">싸피마켓</span>
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 - 중앙 정렬 */}
      <main className="flex flex-col items-center justify-center px-4 py-12">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-12">
          <img src={logo} alt="싸피마켓" className="h-10" />
          <span className="text-2xl font-bold text-gray-900">싸피마켓</span>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
          {/* 학번 입력 - 라벨 없음 */}
          <input
            id="studentId"
            name="studentId"
            type="text"
            placeholder="학번"
            value={formData.studentId}
            onChange={handleChange}
            required
            maxLength={7}
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 이름 입력 - 라벨 없음 */}
          <input
            id="name"
            name="name"
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 반 선택 - 라벨 없음 */}
          <input
            id="class"
            name="class"
            type="text"
            placeholder="반"
            value={formData.class}
            onChange={handleChange}
            required
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 비밀번호 입력 - 라벨 없음 */}
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 비밀번호 확인 - 라벨 없음 */}
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            value={formData.passwordConfirm}
            onChange={handleChange}
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
              회원가입
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              로그인 화면으로
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
