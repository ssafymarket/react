import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Pagination } from '@/components/common/Pagination';
import { getPosts, getPostsByCategory, searchPosts } from '@/api/post';
import { CATEGORIES, SORT_OPTIONS, PAGINATION } from '@/utils/constants';
import type { Product } from '@/types/product';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 페이지네이션 정보
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');

  // URL 파라미터에서 검색어 가져오기
  useEffect(() => {
    const keyword = searchParams.get('search');
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [searchParams]);

  // 게시글 목록 조회
  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (searchKeyword) {
        // 검색
        response = await searchPosts(
          searchKeyword,
          undefined,
          currentPage,
          PAGINATION.pageSize,
          selectedSort
        );
      } else if (selectedCategory === '전체') {
        // 전체 조회
        response = await getPosts(currentPage, PAGINATION.pageSize, selectedSort);
      } else {
        // 카테고리별 조회
        response = await getPostsByCategory(
          selectedCategory,
          currentPage,
          PAGINATION.pageSize,
          selectedSort
        );
      }

      // 이미지 URL을 절대 경로로 변환
      const postsWithFullUrls = response.posts.map(post => ({
        ...post,
        images: post.images.map((url: string) =>
          url.startsWith('http') ? url : `http://k13d201.p.ssafy.io:8083/${url}`
        )
      }));

      setProducts(postsWithFullUrls);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setCurrentPage(response.currentPage);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리, 정렬, 페이지 변경 시 재조회
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSort, currentPage, searchKeyword]);

  // 카테고리 변경
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0); // 첫 페이지로 이동
    setSearchKeyword(''); // 검색어 초기화
    setSearchParams({}); // URL 파라미터 초기화
  };

  // 정렬 변경
  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(0);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="max-w-content mx-auto px-20 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchKeyword ? `"${searchKeyword}" 검색 결과` : selectedCategory}
          </h2>
          <p className="text-gray-600 mt-1">총 {totalItems.toLocaleString()}개의 상품</p>
        </div>

        {/* 카테고리 탭 */}
        {!searchKeyword && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* 정렬 옵션 */}
        <div className="flex justify-end mb-6">
          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

        {/* 상품 그리드 */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20">
                <svg
                  className="w-20 h-20 text-gray-300 mb-4"
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
                <p className="text-gray-500 text-lg">등록된 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.postId} product={product} />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};
