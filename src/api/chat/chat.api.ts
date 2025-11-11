import client from '../client';

/**
 * 채팅방 생성 요청 타입
 */
export type ChatRoomCreateRequest = {
  postId: number;
};

/**
 * 채팅방 DTO 타입
 */
export type ChatRoomDto = {
  roomId: number;
  postId: number;
  postTitle: string;
  postImage: string;
  postPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  iAmBuyer: boolean;
  createdAt: string;
};

/**
 * 채팅방 생성/조회
 * POST /api/chat/room/create
 */
export const createChatRoom = async (postId: number): Promise<ChatRoomDto> => {
  const response = await client.post<ChatRoomDto>('/chat/room/create', {
    postId,
  });

  return response.data;
};
