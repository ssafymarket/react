import { Layout } from '@/components/layout/Layout';

export const ChatListPage = () => {
  return (
    <Layout>
      <div className="max-w-content mx-auto px-20 py-8">
        <h1 className="text-3xl font-bold mb-6">채팅 목록</h1>
        <p className="text-gray-600">채팅 목록이 여기에 표시됩니다.</p>
      </div>
    </Layout>
  );
};
