// 공통 API 응답 타입
export type ApiResponse<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
}

// 페이지네이션 응답 타입
export type PaginatedResponse<T> = {
  success: boolean;
  posts: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

// 에러 응답 타입
export type ErrorResponse = {
  success: false;
  message: string;
}

// 게시글 생성 응답
export type CreatePostResponse = {
  success: boolean;
  postId: number;
  message: string;
}

// 게시글 상세 응답
export type PostDetailResponse = {
  success: boolean;
  post: any; // ProductDetail 타입
}

// 게시글 수정 응답
export type UpdatePostResponse = {
  success: boolean;
  message: string;
  postId: number;
}

// 게시글 삭제 응답
export type DeletePostResponse = {
  success: boolean;
  message: string;
  deletedBy: string;
}

// 상태 변경 응답
export type StatusChangeResponse = {
  success: boolean;
  message: string;
  status: string;
}

// 판매 완료 응답
export type CompleteSaleResponse = {
  success: boolean;
  message: string;
  buyerId: string;
  buyerName: string;
}

// 사용자별 게시글 응답
export type UserPostsResponse = {
  success: boolean;
  studentId?: string;
  posts: any[];
  count: number;
}

// 거래 내역 응답
export type TransactionsResponse = {
  success: boolean;
  transactions: any[];
  soldCount: number;
  purchasedCount: number;
  totalCount: number;
}

// 좋아요 응답
export type LikeResponse = {
  success: boolean;
  message: string;
  likeCount: number;
}

// 좋아요 확인 응답
export type CheckLikeResponse = {
  success: boolean;
  isLiked: boolean;
}

// 채팅방 개수 응답
export type ChatRoomCountResponse = {
  success: boolean;
  postId: number;
  chatRoomCount: number;
}
