import Image from "next/image";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";

interface TravelCardProps {
  item: ApiInformation;
}

export const TravelCard: React.FC<TravelCardProps> = ({ item }) => {
  const router = useRouter();
  return (
    <div
      className="bg-gray-100 w-[220px] h-[280px] relative overflow-hidden cursor-pointer rounded-[6px] transition-transform duration-300 hover:scale-105"
      onClick={() => router.push(`/detail/${item.contentid}`)}
    >
      {item.firstimage ? (
        <Image
          src={item.firstimage}
          alt={item.title}
          width={220}
          height={150}
          className="w-[220px] h-[150px] object-cover rounded-t-[6px]"
        />
      ) : (
        <div className="w-[220px] h-[150px] bg-gray-200 flex items-center justify-center rounded-t-[6px]">
          <span className="text-gray-500 text-sm">No Image Available</span>
        </div>
      )}
      <div className="bg-white w-full h-[130px] overflow-hidden rounded-b-[6px] px-[10px] py-[20px] flex flex-col gap-[8px]">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h2>
        <p className="text-gray-600 text-xs truncate">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
