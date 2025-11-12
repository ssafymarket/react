import { create } from 'zustand';

interface ChatState {
  activeRoomId: number | null;
  unreadCounts: Record<number, number>;
  totalUnreadCount: number; // 전체 안읽은 메시지 개수
  setActiveRoom: (roomId: number | null) => void;
  setUnreadCount: (roomId: number, count: number) => void;
  incrementUnread: (roomId: number) => void;
  clearUnread: (roomId: number) => void;
  setTotalUnreadCount: (count: number) => void; // 전체 안읽은 메시지 개수 설정
}

export const useChatStore = create<ChatState>((set) => ({
  activeRoomId: null,
  unreadCounts: {},
  totalUnreadCount: 0,

  setActiveRoom: (roomId) => {
    set({ activeRoomId: roomId });
  },

  setUnreadCount: (roomId, count) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [roomId]: count,
      },
    }));
  },

  incrementUnread: (roomId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [roomId]: (state.unreadCounts[roomId] || 0) + 1,
      },
    }));
  },

  clearUnread: (roomId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [roomId]: 0,
      },
    }));
  },

  setTotalUnreadCount: (count) => {
    set({ totalUnreadCount: count });
  },
}));
