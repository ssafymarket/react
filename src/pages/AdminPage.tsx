import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { getPendingUsers, approveUser, rejectUser } from '@/api/admin';
import { useAuthStore } from '@/store/authStore';
import logo from '@/assets/icon_logo.svg';

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn, user } = useAuthStore();

  // 승인 대기 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: getPendingUsers,
    enabled: isLoggedIn && user?.role === 'ROLE_ADMIN',
    staleTime: 0,
    refetchOnMount: true,
  });

  const pendingUsers = data?.list || [];

  // 회원 승인 mutation
  const approveMutation = useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      alert('승인되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
    },
    onError: (error) => {
      console.error('승인 실패:', error);
      alert('승인에 실패했습니다.');
    },
  });

  // 회원 거절 mutation
  const rejectMutation = useMutation({
    mutationFn: rejectUser,
    onSuccess: () => {
      alert('거절되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
    },
    onError: (error) => {
      console.error('거절 실패:', error);
      alert('거절에 실패했습니다.');
    },
  });

  const handleApprove = (studentId: string) => {
    if (confirm('승인하시겠습니까?')) {
      approveMutation.mutate(studentId);
    }
  };

  const handleReject = (studentId: string) => {
    if (confirm('거절하시겠습니까?')) {
      rejectMutation.mutate(studentId);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-20 py-12">
        {/* 페이지 제목 */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <img src={logo} alt="관리자" className="h-10" />
          <h1 className="text-3xl font-bold text-gray-900">관리자페이지</h1>
        </div>

        {/* 승인 대기 목록 */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              로딩 중...
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              승인 대기 중인 사용자가 없습니다.
            </div>
          ) : (
            pendingUsers.map((user, index) => (
              <div
                key={`${user.studentId}-${index}`}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 md:p-6 gap-3"
              >
                <div className="text-base md:text-lg text-gray-900">
                  {user.name}({user.studentId}) / {user.className}반
                </div>
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(user.studentId)}
                    disabled={isLoading || approveMutation.isPending || rejectMutation.isPending}
                    className="flex-1 md:flex-initial px-4 md:px-8 py-2 md:py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-600 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(user.studentId)}
                    disabled={isLoading || approveMutation.isPending || rejectMutation.isPending}
                    className="flex-1 md:flex-initial px-4 md:px-8 py-2 md:py-3 bg-white border border-primary text-primary rounded-full font-medium hover:bg-primary-50 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
