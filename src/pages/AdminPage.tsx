import { Layout } from '@/components/layout/Layout';

export const AdminPage = () => {
  return (
    <Layout>
      <div className="max-w-content mx-auto px-20 py-8">
        <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
        <p className="text-gray-600">관리자 대시보드가 여기에 표시됩니다.</p>
      </div>
    </Layout>
  );
};
