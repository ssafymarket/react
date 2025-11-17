import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductListItem } from '@/components/products/ProductListItem';
import { Pagination } from '@/components/common/Pagination';
import { getPosts, getPostsByCategory, searchPosts, getPostsByStatus } from '@/api/post';
import { CATEGORIES, SORT_OPTIONS, PAGINATION } from '@/utils/constants';
import type { Product } from '@/types/product';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 페이지네이션 정보
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 필터 상태 - URL 파라미터에서 초기값 가져오기
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showOnlySelling, setShowOnlySelling] = useState(false);

  // URL 파라미터에서 현재 페이지 가져오기
  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

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
        // 검색 (판매중 필터 적용)
        console.log('검색 실행:', searchKeyword);
        response = await searchPosts(
          searchKeyword,
          showOnlySelling ? '판매중' : undefined,
          currentPage,
          PAGINATION.pageSize,
          selectedSort
        );
        console.log('검색 결과:', response);
      } else if (showOnlySelling) {
        // 판매중만 보기
        response = await getPostsByStatus(
          '판매중',
          currentPage,
          PAGINATION.pageSize,
          selectedSort
        );

        // 카테고리 필터링 (클라이언트)
        if (selectedCategory !== '전체') {
          const filteredPosts = response.posts.filter(
            (post: Product) => post.category === selectedCategory
          );
          response = {
            ...response,
            posts: filteredPosts,
            totalItems: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / PAGINATION.pageSize),
          };
        }
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
          url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
        )
      }));

      setProducts(postsWithFullUrls);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리, 정렬, 페이지, 판매중 필터 변경 시 재조회
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSort, currentPage, searchKeyword, showOnlySelling]);

  // 카테고리 변경
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchKeyword(''); // 검색어 초기화
    setSearchParams({}); // URL 파라미터 초기화 (페이지도 0으로)
  };

  // 정렬 변경
  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    // 페이지를 0으로 리셋
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 0) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="max-w-content mx-auto px-4 md:px-8 lg:px-20 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {searchKeyword ? `"${searchKeyword}" 검색 결과` : selectedCategory}
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">총 {totalItems.toLocaleString()}개의 상품</p>
        </div>

        {/* 카테고리 탭 */}
        {!searchKeyword && (
          <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
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

        {/* 필터 및 정렬 옵션 */}
        <div className="flex justify-end items-center mb-6 gap-3">
          <button
            onClick={() => {
              setShowOnlySelling(!showOnlySelling);
              // 페이지를 0으로 리셋
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('page');
              setSearchParams(newParams);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              showOnlySelling
                ? 'bg-primary text-white'
                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            판매중만 보기
          </button>

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
            {products.length === 0 ? (
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
                  {products.map((product) => (
                    <ProductListItem key={product.postId} product={product} />
                  ))}
                </div>

                {/* 데스크탑: 그리드형 */}
                <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.postId} product={product} />
                  ))}
                </div>
              </>
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
