import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const statusText = {
    SELLING: '판매중',
    RESERVED: '예약중',
    SOLD: '판매완료',
  };

  const statusColor = {
    SELLING: 'text-primary',
    RESERVED: 'text-orange-500',
    SOLD: 'text-gray-500',
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* 이미지 */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
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

        {/* 가격 */}
        <p className="text-lg font-bold text-primary mb-2">
          {product.price.toLocaleString()}원
        </p>

        {/* 상태 및 메타 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className={`font-medium ${statusColor[product.status]}`}>
            {statusText[product.status]}
          </span>
          <div className="flex items-center gap-2">
            <span>조회 {product.viewCount}</span>
            {product.likeCount > 0 && (
              <span>♥ {product.likeCount}</span>
            )}
          </div>
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
