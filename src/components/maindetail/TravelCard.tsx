import { useHandleLikeButton } from "@/hooks/detailpage/useHandleLikeButton";
import { ApiInformation } from "@/types/Main";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const supabase = createClient();

interface TravelCardProps {
  item: ApiInformation;
}

export const TravelCard: React.FC<TravelCardProps> = ({ item }) => {
  const router = useRouter();
  const { id: userId } = useUserStore();

  const { liked, isError, data, isPending, handleLikeButton } = useHandleLikeButton({
    contentId: item.contentid || "",
    imageUrl: item.firstimage || "",
    contentTypeId: item.contenttypeid || "",
    title: item.title || "",
    addr1: item.addr1 || "",
    tel: item.tel || "",
    userId: userId || "",
  });

  const likeImage =
    data && data.find((like) => like.user_id === userId)
      ? "/assets/images/successLikeIcon.svg"
      : "/assets/images/defaultLikeIcon.svg";

  return (
    <div
      className="lg:w-[220px]  lg:h-[242px] w-[104px] h-[166px] flex-shrink-0 relative cursor-pointer rounded-[8px] transition-transform duration-300 hover:scale-105"
      onClick={() => router.push(`/detail/${item.contentid}`)}
    >
      <div className="h-full  relative">
        {item.firstimage ? (
          <div>
            <Image src={item.firstimage} alt={item.title} layout="fill" objectFit="cover" className="rounded-t-[8px]" />
            <button onClick={handleLikeButton} className="absolute top-2 right-2">
              <Image
                src={likeImage}
                alt={liked ? "Unlike" : "Like"}
                width={32}
                height={32}
                className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px] opacity-70"
              />
            </button>
          </div>
        ) : (
          <Image
            src="/assets/images/null_image.svg"
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-[8px]"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white p-2 flex flex-col items-start gap-1.5 self-stretch">
        <h2 className="text-sm font-semibold text-grey-800 truncate w-full">{item.title}</h2>
        <p className="text-grey-600 text-xs truncate w-full">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
