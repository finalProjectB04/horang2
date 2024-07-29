import Image from "next/image";
import { ApiInformation } from "@/types/Main";

interface TravelCardProps {
  item: ApiInformation;
  category: string; // 카테고리 prop 추가
}

export const TravelCard: React.FC<TravelCardProps> = ({ item, category }) => {
  // 카테고리에 따른 아이콘 선택 (예시)
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return "🍽️";
      case "attraction":
        return "🏛️";
      case "accommodation":
        return "🏨";
      default:
        return "📍";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {item.firstimage ? (
        <Image src={item.firstimage} alt={item.title} width={300} height={300} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
          <span className="text-2xl" title={category}>
            {getCategoryIcon(category)}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{item.addr1 || "Address not available"}</p>
        <p className="text-gray-500 text-xs mt-2 capitalize">{category}</p>
      </div>
    </div>
  );
};
