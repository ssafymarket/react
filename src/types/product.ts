// 게시글 이미지 타입
export type PostImage = {
  imageId: number;
  imageUrl: string;
  imageOrder: number;
}

// 게시글 목록 아이템 (간단한 정보)
export type Product = {
  postId: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  status: '판매중' | '판매완료';
  createdAt: string;
  chatRoomCount: number;
  likeCount: number;
  writer: string;           // 작성자 이름 (목록에서는 문자열)
  images: string[];         // 이미지 URL 배열
}

// 게시글 상세 정보
export type ProductDetail = {
  postId: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  status: '판매중' | '판매완료';
  createdAt: string;
  chatRoomCount: number;
  likeCount: number;
  writer: {
    studentId: string;
    name: string;
  };
  images: PostImage[];      // 상세 정보에는 imageId, imageOrder 포함
}

// 판매 완료된 게시글 (구매자 정보 포함)
export type SoldProduct = Product & {
  buyerName?: string;
  buyerId?: string;
}

// 구매한 게시글 (판매자 정보 포함)
export type PurchasedProduct = Product & {
  sellerName?: string;
  sellerId?: string;
}

// 거래 내역
export type Transaction = {
  type: '판매' | '구매';
  post: Product;
  otherParty: {
    studentId: string;
    name: string;
  };
  completedAt: string;
}

// 좋아요한 게시글
export type LikedProduct = Product & {
  likedAt: string;
}

// 게시글 생성 요청 (FormData로 전송)
export type CreateProductRequest = {
  files: File[];            // 1-10개의 이미지 파일
  title: string;
  price: number;
  category: string;
  description?: string;
}

// 게시글 수정 요청
export type UpdateProductRequest = {
  title?: string;
  price?: number;
  category?: string;
  description?: string;
}

// 게시글 필터
export type ProductFilter = {
  search?: string;
  category?: string;
  status?: '판매중' | '판매완료';
  sortBy?: 'latest' | 'popular' | 'lowPrice' | 'highPrice';
  page?: number;
  size?: number;
}
