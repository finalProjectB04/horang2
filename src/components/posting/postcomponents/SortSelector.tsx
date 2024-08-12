import React, { useState, useRef, useEffect, useCallback } from "react";

export type SortOrder = "likes" | "latest" | "oldest" | "none";

interface SortSelectorProps {
  sortOrder: SortOrder;
  onSortChange: (newOrder: SortOrder) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: "likes", label: "좋아요순" },
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ];

  const handleSort = useCallback(
    (newOrder: SortOrder) => {
      if (newOrder !== sortOrder) {
        onSortChange(newOrder);
      }
      setIsOpen(false);
    },
    [onSortChange, sortOrder],
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12;
"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="31.826px" height="32" viewBox="0 0 48 48" fill="currentColor">
          <path d="M8.50133 11.22C12.5413 16.4 20.0013 26 20.0013 26V38C20.0013 39.1 20.9013 40 22.0013 40H26.0013C27.1013 40 28.0013 39.1 28.0013 38V26C28.0013 26 35.4413 16.4 39.4813 11.22C40.5013 9.9 39.5613 8 37.9013 8H10.0813C8.42133 8 7.48133 9.9 8.50133 11.22Z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition ease-in-out duration-300">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value as SortOrder)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortSelector;
