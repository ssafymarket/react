import type { User } from './user';

export type ChatRoom = {
  roomId: number;
  postId: number;
  buyerId: string;
  sellerId: string;
  buyer: User;
  seller: User;
  lastMessage: string | null;
  lastMessageTime: string;
  createdAt: string;
  // UI에서 사용하는 추가 필드
  postTitle?: string;
  postImage?: string | null;
  postPrice?: number;
  unreadCount?: number;
  iAmBuyer?: boolean;
}

export type ChatMessage = {
  messageId: number;
  roomId: number;
  senderId: string;
  sender: User;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string | null;
  messageType?: 'CHAT' | 'ENTER' | 'LEAVE' | 'PRICE_OFFER' | 'SYSTEM';
}

export type SendMessageRequest = {
  roomId: number;
  content: string;
  messageType?: 'CHAT' | 'ENTER';
}
