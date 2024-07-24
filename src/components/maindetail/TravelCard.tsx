import Image from "next/image";
import { ApiInformation } from "@/types/Main";

interface TravelCardProps {
  item: ApiInformation;
}

export const TravelCard: React.FC<TravelCardProps> = ({ item }) => {
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
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
        <p className="text-gray-600 text-sm">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
