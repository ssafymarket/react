import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductListItem } from '@/components/products/ProductListItem';
import { Pagination } from '@/components/common/Pagination';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types/product';
import { getMySellingPosts } from '@/api/post';
import { SORT_OPTIONS } from '@/utils/constants';

export const MySellingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSort, setSelectedSort] = useState('latest');

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
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getMySellingPosts();
        if (response.success) {
          // 이미지 URL을 절대 경로로 변환
          const productsWithFullUrls = response.posts.map((post: Product) => ({
            ...post,
            images: post.images.map((url: string) =>
              url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
            )
          }));

          // 정렬 적용
          const sorted = sortProducts(productsWithFullUrls, selectedSort);
          setProducts(sorted);
        }
      } catch (err) {
        console.error('판매 목록 조회 실패:', err);
        setError('판매 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user, selectedSort, IMAGE_BASE_URL]);

  const sortProducts = (products: Product[], sort: string): Product[] => {
    const sorted = [...products];
    switch (sort) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.likeCount - a.likeCount);
      case 'lowPrice':
        return sorted.sort((a, b) => a.price - b.price);
      case 'highPrice':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(0);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">판매목록</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            총 {products.length.toLocaleString()}개의 상품
          </p>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex justify-end mb-6">
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

        {/* 상품 목록 */}
        {!loading && !error && (
          <>
            {paginatedProducts.length === 0 ? (
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 text-base md:text-lg">등록된 상품이 없습니다.</p>
              </div>
            ) : (
              <>
                {/* 모바일: 리스트형 */}
                <div className="lg:hidden bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {paginatedProducts.map((product) => (
                    <ProductListItem key={product.postId} product={product} />
                  ))}
                </div>

                {/* 데스크탑: 그리드형 */}
                <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.postId} product={product} />
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
