// SearchBar.tsx
import Image from "next/image";
import React from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
}

export const SearchBarButton: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <Image
          src="/assets/images/newdetail.png"
          alt="background"
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
        <div className="absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto my-36">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="검색창"
                className="w-full p-3 md:p-4 text-base md:text-lg bg-black bg-opacity-70 text-white placeholder-gray-400 border-2 border-gray-600 rounded-full shadow-lg focus:outline-none focus:border-blue-950 transition duration-300 ease-in-out"
              />
              <button
                onClick={onSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-blue-950 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
