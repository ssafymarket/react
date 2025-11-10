import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  isSidebarOpen: boolean;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  isSidebarOpen: false,

  openModal: (content) => {
    set({ isModalOpen: true, modalContent: content });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalContent: null });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
}));
