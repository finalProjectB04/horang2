import { useState, useRef } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRegionSelectorOpen: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onRegionSelectorOpen }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex max-w-3xl mx-auto my-36 relative" onClick={handleClick}>
      <input
        ref={inputRef}
        type="text"
        placeholder="시/군/구 또는 검색어를 입력하세요"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full p-3 md:p-4 pl-24 text-base md:text-lg bg-black bg-opacity-70 text-white placeholder-grey-400 border-2 border-grey-600 rounded-full shadow-lg focus:outline-none focus:border-orange-500 transition duration-300 ease-in-out"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRegionSelectorOpen();
        }}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-sm bg-grey-700 text-grey-300 rounded-full hover:bg-grey-600 transition duration-300 ease-in-out"
      >
        시/군/구
      </button>
      {isFocused && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSearchTerm("");
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-grey-200"
        >
          ✕
        </button>
      )}
    </div>
  );
};
