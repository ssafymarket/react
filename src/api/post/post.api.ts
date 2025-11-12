import client from '../client';
import type {
  Product,
  ProductDetail,
  SoldProduct,
  PurchasedProduct,
  Transaction,
  LikedProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product';
import type {
  PaginatedResponse,
  CreatePostResponse,
  PostDetailResponse,
  UpdatePostResponse,
  DeletePostResponse,
  StatusChangeResponse,
  CompleteSaleResponse,
  UserPostsResponse,
  TransactionsResponse,
  LikeResponse,
  CheckLikeResponse,
  ChatRoomCountResponse,
} from '@/types/api';

/**
 * FormData 생성 헬퍼 함수
 */
export const createPostFormData = (data: CreateProductRequest): FormData => {
  const formData = new FormData();

  // 파일 추가 (파라미터 이름: "files")
  data.files.forEach((file) => {
    formData.append('files', file);
  });

  // 기타 필드 추가
  formData.append('title', data.title);
  formData.append('price', data.price.toString());
  formData.append('category', data.category);

  if (data.description) {
    formData.append('description', data.description);
  }

  return formData;
};

// =============================================================================
// 게시글 CRUD
// =============================================================================

/**
 * 게시글 생성 (multipart/form-data)
 */
export const createPost = async (data: CreateProductRequest): Promise<CreatePostResponse> => {
  const formData = createPostFormData(data);

  const response = await client.post<CreatePostResponse>('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 게시글 목록 조회 (페이지네이션)
 */
export const getPosts = async (
  page: number = 0,
  size: number = 8,
  sort: string = 'latest'
): Promise<PaginatedResponse<Product>> => {
  const response = await client.get<PaginatedResponse<Product>>('/posts', {
    params: { page, size, sort },
  });

  return response.data;
};

/**
 * 게시글 상세 조회
 */
export const getPostById = async (postId: number): Promise<PostDetailResponse> => {
  const response = await client.get<PostDetailResponse>(`/posts/${postId}`);
  return response.data;
};

/**
 * 게시글 수정
 */
export const updatePost = async (
  postId: number,
  data: UpdateProductRequest
): Promise<UpdatePostResponse> => {
  const response = await client.put<UpdatePostResponse>(
    `/posts/${postId}`,
    null,
    {
      params: data,
    }
  );

  return response.data;
};

/**
 * 게시글 삭제
 */
export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
  const response = await client.delete<DeletePostResponse>(`/posts/${postId}`);
  return response.data;
};

// =============================================================================
// 게시글 상태 관리
// =============================================================================

/**
 * 게시글 상태 변경 (판매중/판매완료)
 */
export const updatePostStatus = async (
  postId: number,
  status: '판매중' | '판매완료'
): Promise<StatusChangeResponse> => {
  const response = await client.patch<StatusChangeResponse>(
    `/posts/${postId}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};

/**
 * 판매 완료 처리 (구매자 지정)
 */
export const completeSale = async (
  postId: number,
  buyerId: string
): Promise<CompleteSaleResponse> => {
  const response = await client.patch<CompleteSaleResponse>(
    `/posts/${postId}/complete`,
    null,
    {
      params: { buyerId },
    }
  );

  return response.data;
};

// =============================================================================
// 필터링 및 검색
// =============================================================================

/**
 * 카테고리별 게시글 조회
 */
export const getPostsByCategory = async (
  category: string,
  page: number = 0,
  size: number = 8,
  sort: string = 'latest'
): Promise<PaginatedResponse<Product>> => {
  const response = await client.get<PaginatedResponse<Product>>(
    `/posts/category`,
    {
      params: { name: category, page, size, sort },
    }
  );

  return response.data;
};

/**
 * 상태별 게시글 조회
 */
export const getPostsByStatus = async (
  status: '판매중' | '판매완료',
  page: number = 0,
  size: number = 8,
  sort: string = 'latest'
): Promise<PaginatedResponse<Product>> => {
  const response = await client.get<PaginatedResponse<Product>>(
    `/posts/status/${status}`,
    {
      params: { page, size, sort },
    }
  );

  return response.data;
};

/**
 * 게시글 검색
 */
export const searchPosts = async (
  keyword: string,
  status?: '판매중' | '판매완료',
  page: number = 0,
  size: number = 8,
  sort: string = 'latest'
): Promise<PaginatedResponse<Product>> => {
  const params: any = { keyword, page, size, sort };

  if (status) {
    params.status = status;
  }

  const response = await client.get<PaginatedResponse<Product>>('/posts/search', {
    params,
  });

  return response.data;
};

// =============================================================================
// 사용자별 게시글
// =============================================================================

/**
 * 특정 사용자의 게시글 조회
 */
export const getPostsByUser = async (studentId: string): Promise<UserPostsResponse> => {
  const response = await client.get<UserPostsResponse>(`/posts/user/${studentId}`);
  return response.data;
};

/**
 * 내가 판매 중인 게시글 조회
 */
export const getMySellingPosts = async (): Promise<UserPostsResponse> => {
  const response = await client.get<UserPostsResponse>('/posts/my/selling');
  return response.data;
};

/**
 * 내가 판매 완료한 게시글 조회
 */
export const getMySoldPosts = async (): Promise<{ success: boolean; posts: SoldProduct[]; count: number }> => {
  const response = await client.get('/posts/my/sold');
  return response.data;
};

/**
 * 내가 구매한 게시글 조회
 */
export const getMyPurchasedPosts = async (): Promise<{ success: boolean; posts: PurchasedProduct[]; count: number }> => {
  const response = await client.get('/posts/my/purchased');
  return response.data;
};

/**
 * 내 거래 내역 조회 (판매 + 구매)
 */
export const getMyTransactions = async (): Promise<TransactionsResponse> => {
  const response = await client.get<TransactionsResponse>('/posts/my/transactions');
  return response.data;
};

// =============================================================================
// 좋아요 기능
// =============================================================================

/**
 * 좋아요 추가
 */
export const addLike = async (postId: number): Promise<LikeResponse> => {
  const response = await client.post<LikeResponse>(`/posts/${postId}/like`);
  return response.data;
};

/**
 * 좋아요 취소
 */
export const removeLike = async (postId: number): Promise<LikeResponse> => {
  const response = await client.delete<LikeResponse>(`/posts/${postId}/like`);
  return response.data;
};

/**
 * 좋아요한 게시글 목록 조회
 */
export const getLikedPosts = async (): Promise<{ success: boolean; posts: LikedProduct[]; count: number }> => {
  const response = await client.get('/posts/liked');
  return response.data;
};

/**
 * 좋아요 상태 확인
 */
export const checkLikeStatus = async (postId: number): Promise<CheckLikeResponse> => {
  const response = await client.get<CheckLikeResponse>(`/posts/${postId}/like/check`);
  return response.data;
};

// =============================================================================
// 기타
// =============================================================================

/**
 * 채팅방 개수 조회
 */
export const getChatRoomCount = async (postId: number): Promise<ChatRoomCountResponse> => {
  const response = await client.get<ChatRoomCountResponse>(`/posts/${postId}/chatrooms/count`);
  return response.data;
};
