import { create } from 'zustand';

interface ChatState {
  activeRoomId: number | null;
  unreadCounts: Record<number, number>;
  setActiveRoom: (roomId: number | null) => void;
  setUnreadCount: (roomId: number, count: number) => void;
  incrementUnread: (roomId: number) => void;
  clearUnread: (roomId: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeRoomId: null,
  unreadCounts: {},

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
}));
