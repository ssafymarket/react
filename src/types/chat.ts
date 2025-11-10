import type { User } from './user';

export type ChatRoom = {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  buyer: User;
  seller: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ChatMessage = {
  id: number;
  roomId: number;
  senderId: number;
  sender: User;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type SendMessageRequest = {
  roomId: number;
  message: string;
}
