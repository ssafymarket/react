import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

// 더미 데이터 (나중에 API로 교체)
const dummyProducts: Product[] = [
  {
    id: 1,
    title: '맥북 프로 14인치 M3 팝니다',
    description: '깨끗하게 사용한 맥북입니다.',
    price: 1500000,
    category: '전자기기',
    status: 'SELLING',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    sellerId: 1,
    seller: { id: 1, email: 'test@ssafy.com', name: '홍길동', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 123,
    likeCount: 5,
    createdAt: '2025-11-10T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
  },
  {
    id: 2,
    title: '아이패드 프로 11인치 256GB',
    description: '애플펜슬 포함',
    price: 850000,
    category: '전자기기',
    status: 'SELLING',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    sellerId: 2,
    seller: { id: 2, email: 'user@ssafy.com', name: '김철수', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 87,
    likeCount: 3,
    createdAt: '2025-11-09T00:00:00Z',
    updatedAt: '2025-11-09T00:00:00Z',
  },
  {
    id: 3,
    title: '노스페이스 패딩 (L사이즈)',
    description: '한두번 입은 상태',
    price: 120000,
    category: '의류',
    status: 'RESERVED',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    sellerId: 3,
    seller: { id: 3, email: 'buyer@ssafy.com', name: '이영희', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 45,
    likeCount: 2,
    createdAt: '2025-11-08T00:00:00Z',
    updatedAt: '2025-11-08T00:00:00Z',
  },
  {
    id: 4,
    title: '알고리즘 문제해결 전략 (프로그래밍 책)',
    description: '거의 새책',
    price: 35000,
    category: '도서',
    status: 'SELLING',
    images: [],
    sellerId: 1,
    seller: { id: 1, email: 'test@ssafy.com', name: '홍길동', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 23,
    likeCount: 1,
    createdAt: '2025-11-07T00:00:00Z',
    updatedAt: '2025-11-07T00:00:00Z',
  },
  {
    id: 5,
    title: '게이밍 의자',
    description: '시크릿랩 오메가 블랙',
    price: 300000,
    category: '가구',
    status: 'SOLD',
    images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400'],
    sellerId: 4,
    seller: { id: 4, email: 'seller@ssafy.com', name: '박민수', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 156,
    likeCount: 8,
    createdAt: '2025-11-06T00:00:00Z',
    updatedAt: '2025-11-06T00:00:00Z',
  },
  {
    id: 6,
    title: '에어팟 프로 2세대',
    description: '구매한지 3개월',
    price: 200000,
    category: '전자기기',
    status: 'SELLING',
    images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'],
    sellerId: 2,
    seller: { id: 2, email: 'user@ssafy.com', name: '김철수', role: 'USER', createdAt: '', updatedAt: '' },
    viewCount: 92,
    likeCount: 4,
    createdAt: '2025-11-05T00:00:00Z',
    updatedAt: '2025-11-05T00:00:00Z',
  },
];

export const HomePage = () => {
  return (
    <Layout>
      <div className="max-w-content mx-auto px-20 py-8">
        {/* 카테고리 탭 (나중에 추가) */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">전체 상품</h2>
          <p className="text-gray-600 mt-1">총 {dummyProducts.length}개의 상품</p>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-4 gap-6">
          {dummyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};
