import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import iconChat from '@/assets/icon_chat.svg';
import iconHeart from '@/assets/icon_heart.svg';
import iconCarrot from '@/assets/icon_carrot.svg';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  return (
    <Link
      to={`/products/${product.postId}`}
      className="flex gap-3 bg-white p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
    >
      {/* 이미지 (좌측) */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].startsWith('http') ? product.images[0] : `${IMAGE_BASE_URL}${product.images[0]}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            이미지 없음
          </div>
        )}
      </div>

      {/* 정보 (우측) */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* 상단: 제목과 가격 */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            {product.price === 0 ? (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-primary">나눔</span>
                <img src={iconCarrot} alt="나눔" className="w-4 h-4" />
              </div>
            ) : (
              <p className="text-base font-bold text-primary">
                {product.price.toLocaleString()}원
              </p>
            )}

            {/* 판매완료 배지 */}
            {product.status === '판매완료' && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-primary text-white">
                판매완료
              </span>
            )}
          </div>
        </div>

        {/* 하단: 메타 정보 */}
        <div className="flex items-center justify-end gap-2 text-xs text-gray-600">
          {/* 채팅수 */}
          <div className="flex items-center gap-1">
            <img src={iconChat} alt="" className="w-3.5 h-3.5" />
            <span>{product.chatRoomCount}</span>
          </div>
          {/* 좋아요 수 */}
          {product.likeCount > 0 && (
            <div className="flex items-center gap-1">
              <img src={iconHeart} alt="" className="w-3.5 h-3.5" />
              <span>{product.likeCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
