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
      className="bg-gray-100 w-[330px] h-[346px] relative overflow-hidden cursor-pointer rounded-[9.11px] shadow-md transition-transform duration-300 hover:scale-105"
      onClick={() => router.push(`/${item.contentid}/detailpage`)}
    >
      {item.firstimage ? (
        <Image
          src={item.firstimage}
          alt={item.title}
          width={330}
          height={224}
          className="w-[330px] h-[224px] object-cover rounded-t-[9.11px]"
        />
      ) : (
        <div className="w-[330px] h-[224px] bg-gray-200 flex items-center justify-center rounded-t-[9.11px]">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <div className="bg-white w-full h-[122px] overflow-hidden rounded-b-[9.11px] px-[14px] py-[28px] flex flex-col gap-[10px]">
        <h2 className="text-xl font-semibold text-gray-800 truncate">{item.title}</h2>
        <p className="text-gray-600 text-sm truncate">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
