import { useEffect } from "react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchOpen: boolean;
  closeSearchOnClickOutside: (event: MouseEvent) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  isSearchOpen,
  closeSearchOnClickOutside,
}) => {
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

  return (
    <>
      {isSearchOpen && (
        <div className="absolute top-1/2 transform -translate-y-1/2 right-[32px] bg-transparent flex items-center search-content">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="bg-[#062799] border border-gray-300 rounded-lg px-4 py-2 text-white w-64"
            placeholder="Search..."
            autoFocus
          />
        </div>
      )}
    </>
  );
};

export default SearchInput;
