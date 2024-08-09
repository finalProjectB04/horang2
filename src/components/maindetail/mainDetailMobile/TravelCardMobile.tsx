import Image from "next/image";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";

interface TravelCardProps {
  item: ApiInformation;
}

export const TravelCardMobile: React.FC<TravelCardProps> = ({ item }) => {
  const router = useRouter();
  return (
    <div
      className="w-[104px] h-[166px] flex-shrink-0 relative cursor-pointer rounded-[9.11px] transition-transform duration-300 hover:scale-105"
      onClick={() => router.push(`/detail/${item.contentid}`)}
    >
      <div className="h-full relative">
        {item.firstimage ? (
          <Image
            src={item.firstimage}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-[9.11px]"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[9.11px]">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white p-2 flex flex-col items-start gap-1.5 self-stretch">
        <h2 className="text-sm font-semibold text-gray-800 truncate w-full">{item.title}</h2>
        <p className="text-gray-600 text-xs truncate w-full">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
