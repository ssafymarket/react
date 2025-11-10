import { create } from 'zustand';

interface FilterState {
  search: string;
  category: string | null;
  priceRange: [number, number];
  sortBy: 'latest' | 'price-low' | 'price-high' | 'views';
  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  reset: () => void;
}

const initialState = {
  search: '',
  category: null,
  priceRange: [0, 1000000] as [number, number],
  sortBy: 'latest' as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set(initialState),
}));
