import { useSearchStore } from "@/zustand/searchStore";
import { useEffect } from "react";

interface SearchInputProps {
  isSearchOpen: boolean;
  closeSearchOnClickOutside: (event: MouseEvent) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ isSearchOpen, closeSearchOnClickOutside }) => {
  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener("click", closeSearchOnClickOutside);
    } else {
      document.removeEventListener("click", closeSearchOnClickOutside);
    }
    return () => {
      document.removeEventListener("click", closeSearchOnClickOutside);
    };
  }, [isSearchOpen]);

  const { searchTerm, setSearchTerm } = useSearchStore();

  if (!isSearchOpen) return null;

  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 right-[32px] bg-transparent flex items-center search-content z-50">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="bg-[#062799] border border-grey-300 rounded-lg px-4 py-2 text-white w-64"
        placeholder="검색어를 입력해주세요"
        autoFocus
      />
    </div>
  );
};

export default SearchInput;
