import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  isSearching: false,
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
}));
