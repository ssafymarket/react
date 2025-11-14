import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import logo from '@/assets/icon_logo.svg';

// 승인 대기 사용자 타입
type PendingUser = {
  studentId: string;
  name: string;
  class: string;
};

// 더미 승인 대기 목록
const dummyPendingUsers: PendingUser[] = [
  { studentId: '1327907', name: '박두철', class: '4반' },
  { studentId: '1327907', name: '박두철', class: '4반' },
  { studentId: '1327907', name: '박두철', class: '4반' },
  { studentId: '1327907', name: '박두철', class: '4반' },
];

export const AdminPage = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(dummyPendingUsers);

  const handleApprove = (studentId: string) => {
    // TODO: 승인 API 호출
    setPendingUsers(pendingUsers.filter((user) => user.studentId !== studentId));
    alert('승인되었습니다.');
  };

  const handleReject = (studentId: string) => {
    if (confirm('정말 거절하시겠습니까?')) {
      // TODO: 거절 API 호출
      setPendingUsers(pendingUsers.filter((user) => user.studentId !== studentId));
      alert('거절되었습니다.');
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
          {pendingUsers.length === 0 ? (
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
                  {user.name}({user.studentId}) / {user.class}반
                </div>
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(user.studentId)}
                    className="flex-1 md:flex-initial px-4 md:px-8 py-2 md:py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-600 transition-colors text-sm md:text-base"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(user.studentId)}
                    className="flex-1 md:flex-initial px-4 md:px-8 py-2 md:py-3 bg-white border border-primary text-primary rounded-full font-medium hover:bg-primary-50 transition-colors text-sm md:text-base"
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
