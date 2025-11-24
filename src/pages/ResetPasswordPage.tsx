import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { resetUserPassword } from '@/api/admin';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    className: '',
  });
  const [error, setError] = useState('');

  // 비밀번호 초기화 mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetUserPassword,
    onSuccess: () => {
      alert('비밀번호가 초기화되었습니다.');
      navigate('/admin');
    },
    onError: (error) => {
      console.error('비밀번호 초기화 실패:', error);
      setError('비밀번호 초기화에 실패했습니다. 입력한 정보를 확인해주세요.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 입력 검증
    if (!formData.studentId.trim() || !formData.name.trim() || !formData.className.trim()) {
      setError('모든 정보를 입력해주세요.');
      return;
    }

    if (confirm(`${formData.name}(${formData.studentId}) 학생의 비밀번호를 초기화하시겠습니까?`)) {
      resetPasswordMutation.mutate({
        studentId: formData.studentId.trim(),
        name: formData.name.trim(),
        className: formData.className.trim(),
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-20 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원 비밀번호 초기화</h1>
          <p className="text-gray-600">비밀번호를 초기화할 회원의 정보를 입력하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* 학번 */}
          <div className="mb-6">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
              학번 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="학번을 입력하세요"
            />
          </div>

          {/* 이름 */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 반 */}
          <div className="mb-6">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
              반 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="반을 입력하세요"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={resetPasswordMutation.isPending}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? '초기화 중...' : '비밀번호 초기화'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
