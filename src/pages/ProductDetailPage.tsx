import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import type { ProductDetail } from '@/types/product';
import { getPostById, deletePost, addLike, removeLike, checkLikeStatus } from '@/api/post';
import { createOrGetChatRoom } from '@/api/chat';
import { formatRelativeTime } from '@/utils/dateFormatter';
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // 키보드 네비게이션 (이미지 모달)
  useEffect(() => {
    if (!isImageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, currentImageIndex, product]);

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

  // 이미지 모달 네비게이션
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (product && product.images && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // 터치 스와이프 핸들러
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
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


  // 작성자인지 확인
  const isAuthor = user?.studentId === product?.writer.studentId;

  // 관리자 또는 작성자인 경우 메뉴 표시
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const canManagePost = isAuthor || isAdmin;

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
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setIsImageModalOpen(true)}
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
                {/* 판매완료일 때만 배지 표시 (데스크탑에서만) */}
                {product.status === '판매완료' && (
                  <span className="hidden md:inline-block px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white">
                    판매완료
                  </span>
                )}
                {/* 삼점 드롭다운 메뉴 (작성자 또는 관리자만 표시) */}
                {canManagePost && (
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
                        {/* 수정하기는 작성자만 */}
                        {isAuthor && (
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleEdit();
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                          >
                            수정하기
                          </button>
                        )}
                        {/* 삭제하기는 작성자 또는 관리자 */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleDelete();
                          }}
                          className={`w-full px-4 py-3 text-left text-sm text-danger hover:bg-red-50 transition-colors ${
                            isAuthor ? 'rounded-b-lg' : 'rounded-lg'
                          }`}
                        >
                          삭제하기 {isAdmin && !isAuthor && '(관리자)'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* 가격 및 판매완료 배지 (모바일) */}
            <div className="mb-6">
              {product.price === 0 ? (
                <div className="flex items-center gap-2">
                  <p className="text-2xl md:text-3xl font-bold text-primary">나눔</p>
                  <img src={iconCarrot} alt="나눔" className="w-7 h-7" />
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-primary">{product.price.toLocaleString()}원</p>
              )}

              {/* 모바일에서만 표시되는 판매완료 배지 */}
              {product.status === '판매완료' && (
                <div className="md:hidden mt-2">
                  <span className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-primary text-white">
                    판매완료
                  </span>
                </div>
              )}
            </div>

            {/* 카테고리 및 등록일 */}
            <div className="mb-6">
              <span className="text-sm text-gray-600">{product.category}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-sm text-gray-600">{formatRelativeTime(product.createdAt)}</span>
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

      {/* 이미지 원본 보기 모달 */}
      {isImageModalOpen && product?.images && product.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="닫기"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 이미지 카운터 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10">
            {currentImageIndex + 1} / {product.images.length}
          </div>

          {/* 이전 버튼 */}
          {currentImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              aria-label="이전 이미지"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* 다음 버튼 */}
          {currentImageIndex < product.images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              aria-label="다음 이미지"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* 이미지 */}
          <img
            src={product.images[currentImageIndex].imageUrl}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>
      )}
    </Layout>
  );
};