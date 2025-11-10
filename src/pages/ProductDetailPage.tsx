import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { UserProfile } from '@/components/common/UserProfile';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types/product';
import iconHeart from '@/assets/icon_heart.svg';
import iconChat from '@/assets/icon_chat.svg';

// 더미 데이터 (나중에 API로 교체)
const dummyProduct: Product = {
  postId: 1,
  title: '맥북 프로 14인치 M3 팝니다',
  price: 1500000,
  category: '전자기기',
  status: '판매중',
  imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
  writerId: '0112345',
  writer: { studentId: '0112345', name: '홍길동', class: '13기', role: 'ROLE_USER' },
  chatRoomCount: 5,
  likeCount: 12,
  isLiked: false,
  createdAt: '2025-11-10T00:00:00Z',
};

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // TODO: API에서 실제 데이터 가져오기
  const [product] = useState<Product>(dummyProduct);
  const [isLiked, setIsLiked] = useState(product.isLiked);
  const [likeCount, setLikeCount] = useState(product.likeCount);

  // 작성자인지 확인
  const isAuthor = user?.studentId === product.writerId;

  // 좋아요 토글
  const handleLikeToggle = () => {
    // TODO: API 호출
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // 채팅하기
  const handleChat = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    // TODO: 채팅방 생성 API 호출 후 채팅 페이지로 이동
    navigate('/chat');
  };

  // 수정하기
  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  // 삭제하기
  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 호출
      navigate('/');
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-20 py-8">
        <div className="grid grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 */}
          <div className="space-y-4">
            {/* 메인 이미지 */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
              {/* 이미지 카운터 */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                1/4
              </div>
            </div>

            {/* 썸네일 이미지들 */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <img
                    src={product.imageUrl}
                    alt={`썸네일 ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="flex flex-col">
            {/* 작성자 정보와 판매중 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserProfile user={product.writer} size="md" showInfo={false} />
                <div>
                  <p className="font-medium text-gray-900">{product.writer.name}</p>
                  <p className="text-sm text-gray-600">학번: {product.writer.studentId}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-50 text-primary border border-primary rounded-lg text-sm font-medium">
                판매중
              </button>
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* 가격 */}
            <p className="text-3xl font-bold text-primary mb-6">
              {product.price.toLocaleString()}원
            </p>

            {/* 여성의류 카테고리 */}
            <div className="mb-6">
              <span className="text-sm text-gray-600">여성의류</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-sm text-gray-600">{formatDate(product.createdAt)}</span>
            </div>

            {/* 상품 설명 */}
            <div className="flex-1 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                브랜드 니트 가디건 판매합니다.
                {'\n\n'}작년에 구매했는데 몇 번 안 입어서 상태 좋습니다.
                {'\n\n'}사이즈는 프리사이즈이고, 색상은 베이지입니다.
                {'\n\n'}직거래 또는 택배 가능합니다.
              </p>
            </div>

            {/* 통계 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <img src={iconHeart} alt="좋아요" className="w-5 h-5" />
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <img src={iconChat} alt="채팅" className="w-5 h-5" />
                {product.chatRoomCount}
              </span>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              {isAuthor ? (
                // 작성자인 경우
                <>
                  <button className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    수정하기
                  </button>
                  <button className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    삭제하기
                  </button>
                </>
              ) : (
                // 작성자가 아닌 경우
                <>
                  <button
                    onClick={handleLikeToggle}
                    className={`px-6 py-3 border rounded-xl font-medium transition-colors flex items-center justify-center ${
                      isLiked
                        ? 'bg-red-50 border-red-500 text-red-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img src={iconHeart} alt="좋아요" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleChat}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    채팅하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
