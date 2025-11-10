import { Layout } from '@/components/layout/Layout';

export const MyPage = () => {
  return (
    <Layout>
      <div className="max-w-content mx-auto px-20 py-8">
        <h1 className="text-3xl font-bold mb-6">마이페이지</h1>
        <p className="text-gray-600">내 판매/구매 내역이 여기에 표시됩니다.</p>
      </div>
    </Layout>
  );
};
