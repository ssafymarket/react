import client from '../client';
import type { ChatRoom, ChatMessage } from '@/types/chat';
import type { User } from '@/types/user';

// 백엔드 DTO Response 타입
export type ChatRoomResponse = {
  roomId: number;
  postId: number;
  postTitle: string;
  postImage: string | null;
  postPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string | null;
  lastMessageTime: string;
  unreadCount: number;
  iAmBuyer: boolean;
  createdAt: string;
};

export type ChatMessageResponse = {
  messageId: number;
  roomId: number;
  senderId: string;
  senderName: string;
  content: string;
  messageType: 'CHAT' | 'ENTER' | 'LEAVE' | 'PRICE_OFFER' | 'SYSTEM' | 'IMAGE';
  sentAt: string;
  isRead: boolean;
  readAt: string | null;
  imageUrl?: string;
};

export type UploadImageResponse = {
  imageUrl: string;
  success: boolean;
  message: string;
};

export type CreateChatRoomRequest = {
  postId: number;
};

// Response를 Domain 모델로 변환하는 유틸리티
export const convertToChatRoom = (response: ChatRoomResponse): ChatRoom & {
  postTitle: string;
  postImage: string | null;
  postPrice: number;
  unreadCount: number;
  iAmBuyer: boolean;
} => {
  const buyer: User = {
    studentId: response.buyerId,
    name: response.buyerName,
    className: '', // 백엔드에서 제공하지 않음
    role: 'ROLE_USER',
  };

  const seller: User = {
    studentId: response.sellerId,
    name: response.sellerName,
    className: '', // 백엔드에서 제공하지 않음
    role: 'ROLE_USER',
  };

  return {
    roomId: response.roomId,
    postId: response.postId,
    buyerId: response.buyerId,
    sellerId: response.sellerId,
    buyer,
    seller,
    lastMessage: response.lastMessage,
    lastMessageTime: response.lastMessageTime,
    createdAt: response.createdAt,
    // 추가 필드
    postTitle: response.postTitle,
    postImage: response.postImage,
    postPrice: response.postPrice,
    unreadCount: response.unreadCount,
    iAmBuyer: response.iAmBuyer,
  };
};

export const convertToChatMessage = (response: ChatMessageResponse): ChatMessage => {
  const sender: User = {
    studentId: response.senderId,
    name: response.senderName,
    className: '', // 백엔드에서 제공하지 않음
    role: 'ROLE_USER',
  };

  return {
    messageId: response.messageId,
    roomId: response.roomId,
    senderId: response.senderId,
    sender,
    content: response.content,
    sentAt: response.sentAt,
    isRead: response.isRead,
    messageType: response.messageType,
    readAt: response.readAt,
    imageUrl: response.imageUrl,
  };
};

/**
 * 채팅방 생성 또는 기존 채팅방 조회
 */
export const createOrGetChatRoom = async (postId: number): Promise<ReturnType<typeof convertToChatRoom>> => {
  const response = await client.post<ChatRoomResponse>('/chat/room/create', { postId });
  return convertToChatRoom(response.data);
};

/**
 * 내 채팅방 목록 조회
 */
export const getChatRooms = async (): Promise<ReturnType<typeof convertToChatRoom>[]> => {
  const response = await client.get<ChatRoomResponse[]>('/chat/rooms');
  return response.data.map(convertToChatRoom);
};

/**
 * 특정 채팅방 조회
 */
export const getChatRoom = async (roomId: number): Promise<ReturnType<typeof convertToChatRoom>> => {
  const response = await client.get<ChatRoomResponse>(`/chat/room/${roomId}`);
  return convertToChatRoom(response.data);
};

/**
 * 채팅방 메시지 히스토리 조회 (페이지네이션)
 */
export const getMessages = async (
  roomId: number,
  page: number = 0,
  size: number = 50
): Promise<ChatMessage[]> => {
  const response = await client.get(`/chat/room/${roomId}/messages`, {
    params: { page, size },
  });

  console.log('getMessages 응답:', response.data);

  // 응답이 배열인 경우 직접 처리
  if (Array.isArray(response.data)) {
    return response.data.map(convertToChatMessage);
  }

  // 응답이 페이지네이션 객체인 경우
  if (response.data.content && Array.isArray(response.data.content)) {
    return response.data.content.map(convertToChatMessage);
  }

  console.error('예상하지 못한 응답 형식:', response.data);
  return [];
};

/**
 * 메시지 읽음 처리 (REST API)
 */
export const markAsRead = async (roomId: number): Promise<void> => {
  await client.put(`/chat/room/${roomId}/read`);
};

/**
 * 특정 채팅방의 읽지 않은 메시지 수 조회
 */
export const getUnreadCount = async (roomId: number): Promise<number> => {
  const response = await client.get<{ count: number }>(`/chat/room/${roomId}/unread-count`);
  return response.data.count;
};

/**
 * 전체 읽지 않은 메시지 수 조회
 */
export const getTotalUnreadCount = async (): Promise<number> => {
  try {
    const response = await client.get<{ totalUnreadCount: number }>('/chat/unread-count');
    return response.data.totalUnreadCount || 0;
  } catch (error) {
    console.error('읽지 않은 메시지 수 조회 실패:', error);
    return 0;
  }
};

/**
 * 채팅방 나가기
 */
export const leaveChatRoom = async (roomId: number): Promise<void> => {
  await client.delete(`/chat/room/${roomId}`);
};

/**
 * 채팅 이미지 업로드
 */
export const uploadChatImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.post<UploadImageResponse>('/chat/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.imageUrl;
};