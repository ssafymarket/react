import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

// 더미 데이터 (나중에 API로 교체)
const dummyProducts: Product[] = [
  {
    postId: 1,
    title: '맥북 프로 14인치 M3 팝니다',
    price: 1500000,
    category: '전자기기',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    writerId: '0112345',
    writer: { studentId: '0112345', name: '홍길동', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 5,
    likeCount: 12,
    isLiked: false,
    createdAt: '2025-11-10T00:00:00Z',
  },
  {
    postId: 2,
    title: '아이패드 프로 11인치 256GB',
    price: 850000,
    category: '전자기기',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    writerId: '0212345',
    writer: { studentId: '0212345', name: '김철수', class: '14기', role: 'ROLE_USER' },
    chatRoomCount: 3,
    likeCount: 8,
    isLiked: false,
    createdAt: '2025-11-09T00:00:00Z',
  },
  {
    postId: 3,
    title: '노스페이스 패딩 (L사이즈)',
    price: 120000,
    category: '의류',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    writerId: '0112346',
    writer: { studentId: '0112346', name: '이영희', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 7,
    likeCount: 15,
    isLiked: true,
    createdAt: '2025-11-08T00:00:00Z',
  },
  {
    postId: 4,
    title: '알고리즘 문제해결 전략 (프로그래밍 책)',
    price: 35000,
    category: '도서',
    status: '판매중',
    imageUrl: '',
    writerId: '0112345',
    writer: { studentId: '0112345', name: '홍길동', class: '13기', role: 'ROLE_USER' },
    chatRoomCount: 2,
    likeCount: 3,
    isLiked: false,
    createdAt: '2025-11-07T00:00:00Z',
  },
  {
    postId: 5,
    title: '게이밍 의자',
    price: 300000,
    category: '가구',
    status: '판매완료',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400',
    writerId: '0212346',
    writer: { studentId: '0212346', name: '박민수', class: '14기', role: 'ROLE_USER' },
    chatRoomCount: 10,
    likeCount: 20,
    isLiked: false,
    createdAt: '2025-11-06T00:00:00Z',
  },
  {
    postId: 6,
    title: '에어팟 프로 2세대',
    price: 200000,
    category: '전자기기',
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    writerId: '0212345',
    writer: { studentId: '0212345', name: '김철수', class: '14기', role: 'ROLE_USER' },
    chatRoomCount: 4,
    likeCount: 6,
    isLiked: false,
    createdAt: '2025-11-05T00:00:00Z',
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
            <ProductCard key={product.postId} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};
