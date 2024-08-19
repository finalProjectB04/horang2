import { useModal } from "@/context/modal.context"; // Modal context import
import { useLikes } from "@/hooks/detailpage/useLikes";
import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const supabase = createClient();

interface TravelCardProps {
  item: ApiInformation;
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
  user_id: string;
}

interface ContextType {
  previousLikes: Likes[] | undefined;
}
export const TravelCard: React.FC<TravelCardProps> = ({ item }) => {
  const [liked, setLiked] = useState<Boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const modal = useModal();
  const { id: userId } = useUserStore();

  const { isPending, isError, data } = useLikes(item.contentid, userId);

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("Likes").delete().match({ user_id: userId, content_id: item.contentid });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>좋아요가 취소되었습니다.</p>
          </div>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["likes", item.contentid] });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 취소 중 에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
    },
  });

  const addMutation = useMutation<Likes, Error, Partial<Likes>, ContextType>({
    mutationFn: async (variables) => {
      if (!userId) {
        modal.open({
          title: "알림",
          content: (
            <div className="text-center">
              <p>로그인 후 좋아요를 누를 수 있습니다.</p>
            </div>
          ),
        });
        throw new Error("세션 정보가 없습니다.");
      }

      const { data, error } = await supabase
        .from("Likes")
        .insert([
          {
            user_id: userId,
            content_id: item.contentid,
            image_url: item.firstimage,
            content_type_id: item.contenttypeid,
            title: item.title,
            address: item.addr1,
            tel: item.tel,
          },
        ])
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("좋아요 추가에 실패했습니다.");
      }

      return data as Likes;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["likes", item.contentid] });
      const previousLikes = queryClient.getQueryData<Likes[]>(["likes", item.contentid]);

      if (previousLikes) {
        queryClient.setQueryData<Likes[]>(["likes", item.contentid], [...previousLikes, variables as Likes]);
      } else {
        queryClient.setQueryData<Likes[]>(["likes", item.contentid], [variables as Likes]);
      }

      return { previousLikes };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", item.contentid] });
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>장소가 나의 공간에</p>
            <p>추가되었습니다.</p>
          </div>
        ),
      });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 등록 중 에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
    },
  });

  useEffect(() => {
    if (data) {
      const result = data.find((like) => like.user_id === userId);
      setLiked(!!result);
    }
  }, [data, userId]);

  if (isPending) {
    return (
      <Image
        src="/assets/images/defaultLikeIcon.svg"
        alt={"Unlike"}
        width={32}
        height={32}
        className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
      />
    );
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  const handleLikeButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); //이벤트 버블링 방지
    try {
      if (liked) {
        deleteMutation.mutate(userId!);
      } else {
        addMutation.mutate({
          user_id: userId,
          content_id: item.contentid,
          image_url: item.firstimage,
          content_type_id: item.contenttypeid,
          title: item.title,
          address: item.addr1,
          tel: item.tel,
        });
      }
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 상태 업데이트를 실패했습니다.</p>
            <p>{(error as Error).message}</p>
          </div>
        ),
      });
    }
  };

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
            <button onClick={handleLikeButton} disabled={!userId} className="absolute top-2 right-2">
              <Image
                src={likeImage}
                alt={liked ? "Unlike" : "Like"}
                width={32}
                height={32}
                className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
              />
            </button>
          </div>
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
