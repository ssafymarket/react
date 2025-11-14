import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import iconChat from '@/assets/icon_chat.svg';
import iconHeart from '@/assets/icon_heart.svg';
import iconCarrot from '@/assets/icon_carrot.svg';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  return (
    <Link
      to={`/products/${product.postId}`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* 이미지 */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].startsWith('http') ? product.images[0] : `${IMAGE_BASE_URL}${product.images[0]}`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이미지 없음
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        {/* 제목 */}
        <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* 가격 및 판매완료 배지 */}
        <div className="flex items-center gap-2 mb-2">
          {product.price === 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">나눔</span>
              <img src={iconCarrot} alt="나눔" className="w-5 h-5" />
            </div>
          ) : (
            <p className="text-lg font-bold text-primary">
              {product.price.toLocaleString()}원
            </p>
          )}

          {/* 판매완료 배지 */}
          {product.status === '판매완료' && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary text-white">
              판매완료
            </span>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
          {/* 채팅수 */}
          <div className="flex items-center gap-1">
            <img src={iconChat} alt="" className="w-4 h-4" />
            <span>{product.chatRoomCount}</span>
          </div>
          {/* 좋아요 수 */}
          {product.likeCount > 0 && (
            <div className="flex items-center gap-1">
              <img src={iconHeart} alt="" className="w-4 h-4" />
              <span>{product.likeCount}</span>
            </div>
          )}
        </div>

        {/* 카테고리 */}
        {product.category && (
          <p className="mt-2 text-xs text-gray-500">
            {product.category}
          </p>
        )}
      </div>
    </Link>
  );
};
