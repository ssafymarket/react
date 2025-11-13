import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductListItem } from '@/components/products/ProductListItem';
import { Pagination } from '@/components/common/Pagination';
import { useAuthStore } from '@/store/authStore';
import type { Transaction } from '@/types/product';
import { getMyTransactions } from '@/api/post';
import { SORT_OPTIONS } from '@/utils/constants';

export const MyTransactionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [filterType, setFilterType] = useState<'all' | '판매' | '구매'>('all');

  // 페이지네이션 상태 (클라이언트 사이드)
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getMyTransactions();
        if (response.success) {
          // 이미지 URL을 절대 경로로 변환
          const transactionsWithFullUrls = response.transactions.map((transaction: Transaction) => ({
            ...transaction,
            post: {
              ...transaction.post,
              images: transaction.post.images.map((url: string) =>
                url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
              )
            }
          }));

          // 정렬 적용
          const sorted = sortTransactions(transactionsWithFullUrls, selectedSort);
          setTransactions(sorted);
        }
      } catch (err) {
        console.error('거래 내역 조회 실패:', err);
        setError('거래 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user, selectedSort, IMAGE_BASE_URL]);

  const sortTransactions = (transactions: Transaction[], sort: string): Transaction[] => {
    const sorted = [...transactions];
    switch (sort) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.post.likeCount - a.post.likeCount);
      case 'lowPrice':
        return sorted.sort((a, b) => a.post.price - b.post.price);
      case 'highPrice':
        return sorted.sort((a, b) => b.post.price - a.post.price);
      default:
        return sorted;
    }
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(0);
  };

  const handleFilterChange = (type: 'all' | '판매' | '구매') => {
    setFilterType(type);
    setCurrentPage(0);
  };

  // 필터링
  const filteredTransactions = filterType === 'all'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="max-w-content mx-auto px-4 md:px-8 lg:px-20 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/mypage')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← 뒤로가기
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">거래내역</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            총 {filteredTransactions.length.toLocaleString()}개의 거래
          </p>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* 거래 타입 필터 */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => handleFilterChange('판매')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === '판매'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              판매
            </button>
            <button
              onClick={() => handleFilterChange('구매')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === '구매'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              구매
            </button>
          </div>

          {/* 정렬 옵션 */}
          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        {/* 거래 내역 목록 */}
        {!loading && !error && (
          <>
            {paginatedTransactions.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20">
                <svg
                  className="w-16 md:w-20 h-16 md:h-20 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 text-base md:text-lg">거래 내역이 없습니다.</p>
              </div>
            ) : (
              <>
                {/* 모바일: 리스트형 */}
                <div className="lg:hidden space-y-4">
                  {paginatedTransactions.map((transaction, index) => (
                    <div
                      key={`${transaction.post.postId}-${index}`}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === '판매'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {transaction.otherParty.name} ({transaction.otherParty.studentId})
                        </span>
                      </div>
                      <ProductListItem product={transaction.post} />
                      <div className="mt-3 text-xs text-gray-500">
                        거래 완료: {new Date(transaction.completedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크탑: 그리드형 */}
                <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedTransactions.map((transaction, index) => (
                    <div key={`${transaction.post.postId}-${index}`} className="relative">
                      <div className="absolute -top-2 -right-2 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                          transaction.type === '판매'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <ProductCard product={transaction.post} />
                      <div className="mt-2 text-xs text-gray-600 text-center">
                        {transaction.otherParty.name} ({transaction.otherParty.studentId})
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {new Date(transaction.completedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
