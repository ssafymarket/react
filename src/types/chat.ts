import type { User } from './user';

export type ChatRoom = {
  roomId: number;           // room_id
  postId: number;           // post_id
  buyerId: string;          // buyer_id (학번)
  sellerId: string;         // seller_id (학번)
  buyer: User;
  seller: User;
  lastMessage: string | null;     // 마지막 메시지 내용
  lastMessageTime: string;        // 마지막 메시지 시간
  createdAt: string;
}

export type ChatMessage = {
  messageId: number;        // message_id
  roomId: number;           // room_id
  senderId: string;         // sender_id (학번)
  sender: User;
  content: string;          // 메시지 내용
  sentAt: string;           // 전송 시각
  isRead: boolean;          // 읽음 여부
}

export type SendMessageRequest = {
  roomId: number;
  content: string;
}
