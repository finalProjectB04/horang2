import React from "react";

const categories = ["전체", "여행", "음식", "축제", "놀거리", "숙소"];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex border-b border-grey-200">
      {categories.map((category) => (
        <button
          key={category}
          className={`p-2 lg:px-4 lg:py-2 font-bold lg:text-base text-xs ${
            selectedCategory === category
              ? "font-bold text-black border-b-2 border-orange-500 "
              : "text-grey-400 hover:text-grey-700"
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
