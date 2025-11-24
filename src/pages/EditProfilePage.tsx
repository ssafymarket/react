import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { updateProfile } from '@/api/user/user.api';
import { getMe } from '@/api/auth';

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // 최신 사용자 정보 가져오기
        const meResponse = await getMe();
        if (meResponse.success && meResponse.user) {
          setFormData({
            name: meResponse.user.name || '',
            password: '',
            confirmPassword: '',
          });
          // store도 업데이트
          updateUser(meResponse.user);
        }
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
        // 에러 발생 시 기존 user 정보 사용
        setFormData({
          name: user.name || '',
          password: '',
          confirmPassword: '',
        });
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // 비밀번호 확인
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password && formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 변경사항이 없는 경우
    if (formData.name === user?.name && !formData.password) {
      setError('변경된 정보가 없습니다.');
      return;
    }

    setLoading(true);

    try {
      // 수정할 데이터 전송 (백엔드 버그로 인해 항상 name을 포함해야 함)
      const updateData: { name: string; password?: string } = {
        name: formData.name, // 항상 포함
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await updateProfile(updateData);

      if (response.success) {
        // 최신 사용자 정보 가져오기
        const meResponse = await getMe();
        if (meResponse.success && meResponse.user) {
          updateUser(meResponse.user);
        }
        alert('회원정보가 수정되었습니다.');
        navigate('/mypage');
      } else {
        setError(response.message || '회원정보 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('회원정보 수정 실패:', err);
      setError('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-20 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원정보 수정</h1>
          <p className="text-gray-600">회원정보를 수정할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* 학번 (읽기 전용) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학번
            </label>
            <input
              type="text"
              value={user.studentId}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
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

          {/* 비밀번호 */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="새 비밀번호를 입력하세요"
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 6자 이상 입력해주세요
            </p>
          </div>

          {/* 비밀번호 확인 */}
          {formData.password && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                maxLength={30}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          )}

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
              onClick={() => navigate('/mypage')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
