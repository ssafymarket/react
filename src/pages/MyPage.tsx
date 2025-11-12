import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import type { Product, Transaction, LikedProduct } from '@/types/product';
import type { User } from '@/types/user';
import { getMySellingPosts, getMyTransactions, getLikedPosts } from '@/api/post';
import { logout as logoutApi, getMe } from '@/api/auth';
import iconPerson from '@/assets/icon_person.svg';
import iconLogout from '@/assets/icon_logout.svg';

export const MyPage = () => {
  const navigate = useNavigate();
  const { user: storeUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'logout'>('info');

  const [user, setUserInfo] = useState<User | null>(storeUser);
  const [sellingProducts, setSellingProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  useEffect(() => {
    if (!storeUser) {
      navigate('/login');
    }
  }, [storeUser, navigate]);

  // 데이터 로드 (사용자 정보 포함)
  useEffect(() => {
    const fetchData = async () => {
      if (!storeUser) return;

      setLoading(true);
      setError('');

      try {
        // 내 정보, 판매 목록, 거래 내역, 좋아요 게시글 동시 조회
        const [meResponse, sellingResponse, transactionsResponse, likedResponse] = await Promise.all([
          getMe(),
          getMySellingPosts(),
          getMyTransactions(),
          getLikedPosts(),
        ]);

        // 최신 사용자 정보 업데이트
        if (meResponse.success && meResponse.user) {
          setUserInfo(meResponse.user);
        }

        if (sellingResponse.success) {
          // 이미지 URL을 절대 경로로 변환
          const postsWithFullUrls = sellingResponse.posts.map(post => ({
            ...post,
            images: post.images.map((url: string) =>
              url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
            )
          }));
          setSellingProducts(postsWithFullUrls);
        }

        if (transactionsResponse.success) {
          // 거래내역의 이미지 URL도 변환
          const transactionsWithFullUrls = transactionsResponse.transactions.map(transaction => ({
            ...transaction,
            post: {
              ...transaction.post,
              images: transaction.post.images.map((url: string) =>
                url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
              )
            }
          }));
          setTransactions(transactionsWithFullUrls);
        }

        if (likedResponse.success) {
          // 좋아요 게시글의 이미지 URL도 변환
          const likedWithFullUrls = likedResponse.posts.map(post => ({
            ...post,
            images: post.images.map((url: string) =>
              url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
            )
          }));
          setLikedProducts(likedWithFullUrls);
        }
      } catch (err) {
        console.error('데이터 조회 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <aside className="bg-white rounded-2xl border border-gray-200 p-8 h-fit">
            {/* 프로필 정보 */}
            <div className="text-left mb-8">
              <p className="text-lg font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">학번: {user.studentId}</p>
              {user.className && <p className="text-sm text-gray-600">반: {user.className}</p>}
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
                  <p className="text-lg text-gray-900">{user.className || '-'}</p>
                </div>
              </div>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <div className="flex justify-center items-center py-20">
                <div className="text-danger">{error}</div>
              </div>
            )}

            {/* 데이터 표시 */}
            {!loading && !error && (
              <>
                {/* 판매목록 */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      판매목록 <span className="text-primary">{sellingProducts.length}개</span>
                    </h2>
                  </div>

                  {sellingProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">판매 중인 상품이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {/* 모바일: 리스트 형태 */}
                      <div className="space-y-3 mb-4 lg:hidden">
                        {sellingProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.postId}
                            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-primary cursor-pointer transition-colors"
                            onClick={() => navigate(`/products/${product.postId}`)}
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{product.title}</p>
                              <p className="text-sm text-gray-600">{product.price.toLocaleString()}원</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 데스크탑: 그리드 형태 */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                        {sellingProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.postId}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary cursor-pointer transition-colors"
                            onClick={() => navigate(`/products/${product.postId}`)}
                          >
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <p className="font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</p>
                              <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                              <p className="text-sm text-gray-500 mt-1">{product.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {sellingProducts.length > 3 && (
                        <button
                          onClick={() => navigate('/my/selling')}
                          className="w-full px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary-50 transition-colors"
                        >
                          전체보기
                        </button>
                      )}
                    </>
                  )}
                </section>

                {/* 좋아요 */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      좋아요 <span className="text-primary">{likedProducts.length}개</span>
                    </h2>
                  </div>

                  {likedProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">좋아요 누른 상품이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {/* 모바일: 리스트 형태 */}
                      <div className="space-y-3 mb-4 lg:hidden">
                        {likedProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.postId}
                            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-primary cursor-pointer transition-colors"
                            onClick={() => navigate(`/products/${product.postId}`)}
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{product.title}</p>
                              <p className="text-sm text-gray-600">{product.price.toLocaleString()}원</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 데스크탑: 그리드 형태 */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                        {likedProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.postId}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary cursor-pointer transition-colors"
                            onClick={() => navigate(`/products/${product.postId}`)}
                          >
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <p className="font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</p>
                              <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                              <p className="text-sm text-gray-500 mt-1">{product.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {likedProducts.length > 3 && (
                        <button
                          onClick={() => navigate('/my/liked')}
                          className="w-full px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary-50 transition-colors"
                        >
                          전체보기
                        </button>
                      )}
                    </>
                  )}
                </section>

                {/* 거래내역 */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      거래내역 <span className="text-primary">{transactions.length}개</span>
                    </h2>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                      <p className="text-gray-500">거래 내역이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {/* 모바일: 리스트 형태 */}
                      <div className="space-y-3 mb-4 lg:hidden">
                        {transactions.slice(0, 3).map((transaction, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                              transaction.type === '판매'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                            onClick={() => navigate(`/products/${transaction.post.postId}`)}
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {transaction.post.images && transaction.post.images.length > 0 && (
                                <img
                                  src={transaction.post.images[0]}
                                  alt={transaction.post.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{transaction.post.title}</p>
                              <p className="text-sm text-gray-600">{transaction.post.price.toLocaleString()}원</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                transaction.type === '판매'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 데스크탑: 그리드 형태 */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                        {transactions.slice(0, 3).map((transaction, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary cursor-pointer transition-colors"
                            onClick={() => navigate(`/products/${transaction.post.postId}`)}
                          >
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                              {transaction.post.images && transaction.post.images.length > 0 && (
                                <img
                                  src={transaction.post.images[0]}
                                  alt={transaction.post.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <p className="font-medium text-gray-900 mb-1 line-clamp-1">
                                {transaction.post.title}
                              </p>
                              <p className="text-lg font-bold text-gray-900 mb-2">
                                {transaction.post.price.toLocaleString()}원
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                  transaction.type === '판매'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {transactions.length > 3 && (
                        <button
                          onClick={() => navigate('/my/transactions')}
                          className="w-full px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary-50 transition-colors"
                        >
                          전체보기
                        </button>
                      )}
                    </>
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};
