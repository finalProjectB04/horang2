// CategorySelector.tsx
import React from "react";

const categories = ["전체", "여행지", "음식", "축제", "놀거리", "숙소"];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 font-bold text-base  ${
            selectedCategory === category
              ? "font-bold text-black border-b-2 border-orange-500 "
              : "text-gray-400 hover:text-gray-700"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
