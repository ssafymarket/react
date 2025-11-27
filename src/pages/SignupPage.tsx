import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '@/assets/icon_logo.svg';
import { signup } from '@/api/auth';

export const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    campus: '',
    className: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 반 입력란은 숫자만 허용
    if (name === 'className' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 기본 유효성 검사
    if (!formData.studentId || !formData.name || !formData.campus || !formData.password || !formData.passwordConfirm) {
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
      // 캠퍼스 한글 -> 영어 대문자 매핑
      const campusMap: { [key: string]: string } = {
        '서울': 'SEOUL',
        '대전': 'DAEJEON',
        '광주': 'GWANGJU',
        '구미': 'GUMI',
        '부울경': 'BUULGYEONG'
      };

      // 회원가입 API 호출
      const response = await signup({
        studentId: formData.studentId,
        name: formData.name,
        className: formData.className,
        campus: campusMap[formData.campus] || formData.campus,
        password: formData.password,
      });

      // 회원가입 성공 후 완료 페이지로 이동
      if (response.success) {
        navigate('/signup/complete');
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
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
        <div className="flex items-center gap-2 mb-12">
          <span className="text-3xl font-bold text-gray-900">회원가입</span>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
          {/* 학번 */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
              학번
            </label>
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
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={30}
              className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 캠퍼스 & 반 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 캠퍼스 */}
            <div>
              <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                캠퍼스
              </label>
              <select
                id="campus"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                required
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3 3 3-3' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em 1.5em',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#E6EDF6'
                }}
                className="w-full pl-6 pr-12 py-4 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="" disabled>캠퍼스 선택</option>
                <option value="서울">서울</option>
                <option value="대전">대전</option>
                <option value="광주">광주</option>
                <option value="구미">구미</option>
                <option value="부울경">부울경</option>
              </select>
            </div>

            {/* 반 */}
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                반
              </label>
              <input
                id="className"
                name="className"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="반"
                value={formData.className}
                onChange={handleChange}
                required
                maxLength={3}
                className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                현재 속한 반 기준 숫자만 입력해주세요
              </p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
              maxLength={30}
              className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
              <p className="text-xs text-gray-500 mt-1">
                비밀번호는 6자 이상 입력해주세요
              </p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              maxLength={30}
              className="w-full px-6 py-4 bg-[#E6EDF6] border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* 버튼 영역 - 나란히 배치 */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              뒤로가기
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              가입 신청
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
