import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import type { ProductDetail } from '@/types/product';
import { getPostById, deletePost, addLike, removeLike, checkLikeStatus } from '@/api/post';
import { createOrGetChatRoom } from '@/api/chat';
import iconHeart from '@/assets/icon_heart.svg';
import iconHeartFilled from '@/assets/icon_heart_filled.svg';
import iconChat from '@/assets/icon_chat.svg';
import iconCarrot from '@/assets/icon_carrot.svg';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  // 상품 정보 로드
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError('');

      try {
        const response = await getPostById(parseInt(id));

        if (response.success && response.post) {
          // 이미지 URL을 절대 경로로 변환
          const productWithFullUrls = {
            ...response.post,
            images: response.post.images.map((img: any) => ({
              ...img,
              imageUrl: img.imageUrl.startsWith('http')
                ? img.imageUrl
                : `${IMAGE_BASE_URL}${img.imageUrl}`
            }))
          };
          setProduct(productWithFullUrls);
          setLikeCount(response.post.likeCount);

          // 로그인한 경우 좋아요 상태 확인
          if (user) {
            const likeStatusResponse = await checkLikeStatus(parseInt(id));
            if (likeStatusResponse.success) {
              setIsLiked(likeStatusResponse.isLiked);
            }
          }
        } else {
          setError(response.message || '상품 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('상품 조회 실패:', err);
        setError('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      if (isLiked) {
        const response = await removeLike(parseInt(id));
        if (response.success) {
          setIsLiked(false);
          setLikeCount(response.likeCount);
        }
      } else {
        const response = await addLike(parseInt(id));
        if (response.success) {
          setIsLiked(true);
          setLikeCount(response.likeCount);
        }
      }
    } catch (err) {
      console.error('좋아요 실패:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 채팅하기
  const handleChat = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!id) return;

    // 작성자인지 확인
    const isAuthor = user?.studentId === product?.writer.studentId;
    if (isAuthor) {
      alert('자신의 상품에는 채팅을 할 수 없습니다.');
      return;
    }

    try {
      // 채팅방 생성 또는 기존 채팅방 조회
      const chatRoom = await createOrGetChatRoom(parseInt(id));

      // 채팅방으로 이동
      navigate(`/chat?roomId=${chatRoom.roomId}`);
    } catch (err: any) {
      console.error('채팅방 생성 실패:', err);
      if (err.response?.status === 400) {
        alert('자신의 상품에는 채팅을 할 수 없습니다.');
      } else {
        alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 수정하기
  const handleEdit = () => {
    navigate(`/products/${id}/edit`, { replace: true });
  };

  // 채팅 목록 보기
  const handleViewChats = () => {
    navigate('/chat');
  };

  // 삭제하기
  const handleDelete = async () => {
    if (!id) return;

    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await deletePost(parseInt(id));
      if (response.success) {
        alert('게시글이 삭제되었습니다.');
        navigate('/');
      } else {
        alert(response.message || '게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
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

  // 작성자인지 확인
  const isAuthor = user?.studentId === product?.writer.studentId;

  // 로딩 상태
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // 에러 상태
  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-danger mb-4">{error || '상품을 찾을 수 없습니다.'}</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4 md:py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 md:mb-6"
        >
          ← 뒤로가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* 왼쪽: 이미지 */}
          <div className="space-y-4">
            {/* 메인 이미지 */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex].imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
              {/* 이미지 카운터 */}
              {product.images && product.images.length > 0 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{product.images.length}
                </div>
              )}
            </div>

            {/* 썸네일 이미지들 */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={image.imageId}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-opacity ${
                      currentImageIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽: 정보 */}
          <div className="flex flex-col">
            {/* 작성자 정보와 상태 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {product.writer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.writer.name}</p>
                  <p className="text-sm text-gray-600">학번: {product.writer.studentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    product.status === '판매중'
                      ? 'bg-primary-50 text-primary border border-primary'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {product.status}
                </span>
                {/* 삼점 드롭다운 메뉴 (작성자만 표시) */}
                {isAuthor && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="메뉴"
                    >
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                    {/* 드롭다운 메뉴 */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleEdit();
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleDelete();
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-danger hover:bg-red-50 rounded-b-lg transition-colors"
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* 가격 */}
            {product.price === 0 ? (
              <div className="flex items-center gap-2 mb-6">
                <p className="text-2xl md:text-3xl font-bold text-primary">나눔</p>
                <img src={iconCarrot} alt="나눔" className="w-7 h-7" />
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-primary mb-6">{product.price.toLocaleString()}원</p>
            )}

            {/* 카테고리 및 등록일 */}
            <div className="mb-6">
              <span className="text-sm text-gray-600">{product.category}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-sm text-gray-600">{formatDate(product.createdAt)}</span>
            </div>

            {/* 상품 설명 */}
            <div className="flex-1 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description || '상품 설명이 없습니다.'}
              </p>
            </div>

            {/* 통계 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <img src={isLiked ? iconHeartFilled : iconHeart} alt="좋아요" className="w-5 h-5" />
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <img src={iconChat} alt="채팅" className="w-5 h-5" />
                {product.chatRoomCount}
              </span>
            </div>

            {/* 버튼 영역 */}
            {isAuthor ? (
              // 작성자인 경우: 채팅 목록 보기 버튼만
              <button
                onClick={handleViewChats}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                채팅 목록 보기
              </button>
            ) : (
              // 작성자가 아닌 경우: 좋아요 + 채팅하기
              <div className="flex gap-3">
                <button
                  onClick={handleLikeToggle}
                  className={`px-6 py-3 border rounded-xl font-medium transition-colors flex items-center justify-center ${
                    isLiked
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <img src={isLiked ? iconHeartFilled : iconHeart} alt="좋아요" className="w-6 h-6" />
                </button>
                <button
                  onClick={handleChat}
                  disabled={product.status === '판매완료'}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                    product.status === '판매완료'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-600'
                  }`}
                >
                  채팅하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};