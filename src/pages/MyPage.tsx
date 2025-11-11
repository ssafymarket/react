import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { UserProfile } from '@/components/common/UserProfile';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types/product';
import iconPerson from '@/assets/icon_person.svg';
import iconLogout from '@/assets/icon_logout.svg';
import { logout as logoutApi } from '@/api/auth';

// 더미 판매목록
const dummyProducts: Product[] = [
  {
    postId: 1,
    title: '아이폰 13 Pro',
    price: 850000,
    category: '전자기기',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5ce?w=300',
    writerId: '1327907',
    writer: { studentId: '1327907', name: '박두철', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 3,
    likeCount: 8,
    isLiked: true,
    createdAt: '2025-11-09T00:00:00Z',
  },
  {
    postId: 2,
    title: '맥북 에어 M2',
    price: 1200000,
    category: '전자기기',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
    writerId: '1327907',
    writer: { studentId: '1327907', name: '박두철', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 5,
    likeCount: 12,
    isLiked: true,
    createdAt: '2025-11-08T00:00:00Z',
  },
  {
    postId: 3,
    title: '경영학 교재',
    price: 25000,
    category: '도서',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    writerId: '1327907',
    writer: { studentId: '1327907', name: '박두철', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 2,
    likeCount: 4,
    isLiked: true,
    createdAt: '2025-11-07T00:00:00Z',
  },
];

// 더미 거래내역
const dummyTransactions: Product[] = [
  {
    postId: 4,
    title: '아이패드 프로',
    price: 750000,
    category: '전자기기',
    status: '판매완료',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    writerId: '0112345',
    writer: { studentId: '0112345', name: '홍길동', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 4,
    likeCount: 10,
    isLiked: false,
    createdAt: '2025-11-05T00:00:00Z',
  },
  {
    postId: 5,
    title: '무선 키보드',
    price: 80000,
    category: '전자기기',
    status: '판매완료',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
    writerId: '0112346',
    writer: { studentId: '0112346', name: '김철수', class: '14기', role: 'ROLE_USER' },
    chatRoomCount: 2,
    likeCount: 5,
    isLiked: false,
    createdAt: '2025-11-04T00:00:00Z',
  },
  {
    postId: 6,
    title: '대학 교재',
    price: 30000,
    category: '도서',
    status: '판매완료',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300',
    writerId: '0112347',
    writer: { studentId: '0112347', name: '이영희', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 1,
    likeCount: 3,
    isLiked: false,
    createdAt: '2025-11-03T00:00:00Z',
  },
];

export const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'logout'>('info');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        // 로그아웃 API 호출
        await logoutApi();
      } catch (err) {
        console.error('로그아웃 API 호출 실패:', err);
      } finally {
        // API 호출 성공 여부와 관계없이 로컬 상태 클리어
        logout();
        navigate('/');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* 왼쪽 사이드바 */}
          <aside className="bg-gray-50 rounded-2xl p-6">
            {/* 프로필 정보 */}
            <div className="text-center mb-8">
              <p className="mt-4 text-lg font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.studentId}</p>
            </div>

            {/* 탭 메뉴 */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'info'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <img src={iconPerson} alt="" className="w-5 h-5" />
                내 정보
              </button>
              <button
                onClick={() => {
                  setActiveTab('logout');
                  handleLogout();
                }}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'logout'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <img src={iconLogout} alt="" className="w-5 h-5" />
                로그아웃
              </button>
            </nav>
          </aside>

          {/* 오른쪽 메인 콘텐츠 */}
          <main>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
              <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                설정
              </button>
            </div>

            {/* 사용자 정보 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">학번</label>
                  <p className="text-lg text-gray-900">{user.studentId}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">이름</label>
                  <p className="text-lg text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">반</label>
                  <p className="text-lg text-gray-900">4반</p>
                </div>
              </div>
            </div>

            {/* 판매목록 */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  판매목록 <span className="text-primary">{dummyProducts.length}개</span>
                </h2>
              </div>

              {/* 모바일: 리스트 형태 */}
              <div className="space-y-3 mb-4 lg:hidden">
                {dummyProducts.map((product) => (
                  <div
                    key={product.postId}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => navigate(`/products/${product.postId}`)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">{product.price.toLocaleString()}원</p>
                    </div>
                    <button className="text-red-500 text-xl">♥</button>
                  </div>
                ))}
              </div>

              {/* 데스크탑: 그리드 형태 */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                {dummyProducts.map((product) => (
                  <div
                    key={product.postId}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary cursor-pointer transition-colors"
                    onClick={() => navigate(`/products/${product.postId}`)}
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-900 mb-1">{product.title}</p>
                      <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary-50 transition-colors">
                전체보기
              </button>
            </section>

            {/* 거래내역 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  거래내역 <span className="text-primary">{dummyTransactions.length}개</span>
                </h2>
              </div>

              {/* 모바일: 리스트 형태 */}
              <div className="space-y-3 mb-4 lg:hidden">
                {dummyTransactions.map((product) => (
                  <div
                    key={product.postId}
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                      product.status === '판매완료'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => navigate(`/products/${product.postId}`)}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">{product.price.toLocaleString()}원</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === '판매완료'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* 데스크탑: 그리드 형태 */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                {dummyTransactions.map((product) => (
                  <div
                    key={product.postId}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary cursor-pointer transition-colors"
                    onClick={() => navigate(`/products/${product.postId}`)}
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-900 mb-1">{product.title}</p>
                      <p className="text-lg font-bold text-gray-900 mb-2">{product.price.toLocaleString()}원</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === '판매완료'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary-50 transition-colors">
                전체보기
              </button>
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
};
