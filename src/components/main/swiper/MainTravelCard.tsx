import Image from "next/image";
import { ApiInformation } from "@/types/Main";

interface TravelCardProps {
  item: ApiInformation;
}

export const MainTravelCard = ({ item }: TravelCardProps) => (
  <div className="bg-gray-100">
    {item.firstimage ? (
      <Image src={item.firstimage} alt={item.title} width={300} height={300} className="w-full h-48 object-cover" />
    ) : (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image Available</span>
      </div>
    )}
    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
        <p className="text-gray-600 text-sm">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  </div>
);
