import type { User } from './user';

export type Product = {
  postId: number;           // post_id
  title: string;
  price: number;
  category: string;
  createdAt: string;
  chatRoomCount: number;    // 채팅방 개수 (조회수 대신)
  likeCount: number;
  isLiked: boolean;         // 현재 유저가 좋아요 눌렀는지
  status: '판매중' | '판매완료';
  writerId: string;         // writer_id (학번)
  writer: User;             // 작성자 정보
  imageUrl: string;         // 단일 이미지 URL (S3)
}

export type CreateProductRequest = {
  title: string;
  price: number;
  category: string;
  imageUrl: string;         // 단일 이미지
}

export type UpdateProductRequest = {
  title?: string;
  price?: number;
  category?: string;
  status?: '판매중' | '판매완료';
  imageUrl?: string;
}

export type ProductFilter = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: '판매중' | '판매완료';
  sortBy?: 'latest' | 'price-low' | 'price-high';
  page?: number;
  size?: number;
}
