"use Client";

import { useModal } from "@/context/modal.context";
import { useLikes } from "@/hooks/detailpage/useLikes";
import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { convertToHttps } from "@/utils/convertToHttps";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SkeletonCard } from "@/components/maindetail/SkeletonCard";
import TravelSwiperSkeleton from "./TravelSwiperSkeleton ";

const supabase = createClient();

interface MainTravelSliderProps {
  travel: ApiInformation[];
}
interface ContextType {
  previousLikes: Likes[] | undefined;
}

export const MainTravelSlider: React.FC<MainTravelSliderProps> = ({ travel }) => {
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore();
  const modal = useModal();
  const item = travel[0] as ApiInformation;

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

        throw new Error();
      }

      const { data, error } = await supabase
        .from("Likes")
        .insert([
          {
            user_id: userId,
            content_id: variables.content_id,
            image_url: variables.image_url,
            content_type_id: variables.content_type_id,
            title: variables.title,
            address: variables.address,
            tel: variables.tel,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>데이터가 없습니다.</p>
            </div>
          ),
        });
        throw new Error();
      }

      return data as Likes;
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["likes", variables.content_id] });
      const previousLikes = queryClient.getQueryData<Likes[]>(["likes", variables.content_id]);

      if (previousLikes) {
        const newLikes = [...previousLikes, variables as Likes];
        queryClient.setQueryData<Likes[]>(["likes", variables.content_id], newLikes);
      } else {
        queryClient.setQueryData<Likes[]>(["likes", variables.content_id], [variables as Likes]);
      }

      return { previousLikes };
    },

    onSettled: (variables) => {
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>장소가 나의 공간에</p>
            <p>추가되었습니다.</p>
          </div>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["likes", variables?.content_id] });
    },

    onError: (error, variables, context) => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 등록 중 에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });

      if (context?.previousLikes) {
        queryClient.setQueryData<Likes[]>(["likes", variables?.content_id], context.previousLikes);
      }
    },
  });
  const handleLikeButton = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const contentId = event.currentTarget.getAttribute("data-contentid"); // 클릭된 버튼의 contentId 가져오기

      if (!contentId) {
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>Content ID가 없습니다!</p>
            </div>
          ),
        });

        return;
      }

      try {
        if (likedStates[contentId]) {
          deleteMutation.mutate(userId!);
        } else {
          const item = travel.find((item) => item.contentid === contentId); // travel 배열에서 해당 contentId를 가진 item 찾기

          if (!item) {
            modal.open({
              title: "에러",
              content: (
                <div className="text-center">
                  <p>Item not found 에러</p>
                </div>
              ),
            });
            return;
          }

          addMutation.mutate({
            user_id: userId!,
            content_id: item.contentid,
            image_url: item.firstimage,
            content_type_id: item.contenttypeid,
            title: item.title,
            address: item.addr1,
            tel: item.tel,
          });
        }

        setLikedStates((prevStates) => ({
          ...prevStates,
          [contentId]: !prevStates[contentId],
        }));
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
    },
    [likedStates, addMutation, deleteMutation, userId, modal, travel],
  );

  useEffect(() => {
    if (data) {
      const newLikedStates = travel.reduce((acc, item) => {
        const result = data.find((like) => like.user_id === userId && like.content_id === item.contentid);
        acc[item.contentid] = !!result;
        return acc;
      }, {} as Record<string, boolean>);
      setLikedStates(newLikedStates);
    }
  }, [data, travel, userId]);
  if (isPending) {
    return <TravelSwiperSkeleton />;
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  const likeImage =
    data && data.find((like) => like.user_id === userId)
      ? "/assets/images/successLikeIcon.svg"
      : "/assets/images/defaultLikeIcon.svg";

  return (
    <Swiper
      modules={isLgScreen ? [Autoplay, A11y] : [Grid, A11y, Autoplay]}
      spaceBetween={isLgScreen ? 40 : 20}
      slidesPerView={travel.length >= 4 ? 4 : travel.length}
      slidesPerGroup={isLgScreen ? 4 : undefined}
      grid={
        !isLgScreen
          ? {
              rows: 2,
              fill: "row",
            }
          : undefined
      }
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className={`w-full ${
        isLgScreen
          ? "h-[280px]"
          : "rounded-[8px] lg:h-full lg:w-[708px] h-[346px] flex flex-col items-start gap-3 self-stretch"
      }`}
      observer={!isLgScreen}
      observeParents={!isLgScreen}
      onInit={
        !isLgScreen
          ? (swiper) => {
              setTimeout(() => {
                swiper.update();
              }, 0);
            }
          : undefined
      }
    >
      {travel.map((item) => (
        <SwiperSlide key={item.contentid} className={isLgScreen ? "w-[220px] h-[280px]" : "h-[166px]"}>
          <div
            className={`${
              isLgScreen ? "w-[220px] h-[280px]" : "lg:w-[330px] lg:h-[346px] w-[104px] h-[166px]"
            } relative cursor-pointer rounded-[6px] transition-transform duration-300 hover:scale-105`}
            onClick={() => router.push(`/detail/${item.contentid}`)}
          >
            <div
              className={`${
                isLgScreen ? "h-[150px]" : "lg:h-[224px] h-[110px]"
              } relative rounded-t-[6px] overflow-hidden`}
            >
              {item.firstimage ? (
                <div>
                  <Image
                    src={convertToHttps(item.firstimage)}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-[8px]"
                  />
                  <button
                    data-contentid={item.contentid}
                    onClick={(event) => handleLikeButton(event)}
                    disabled={!userId}
                    className="absolute top-2 right-2 opacity-70"
                  >
                    <Image
                      src={
                        likedStates[item.contentid]
                          ? "/assets/images/successLikeIcon.svg"
                          : "/assets/images/defaultLikeIcon.svg"
                      }
                      alt={likedStates[item.contentid] ? "Unlike" : "Like"}
                      width={32}
                      height={32}
                      className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
                    />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full bg-grey-200 flex items-center justify-center rounded-t-[6px]">
                  <span className="text-grey-500 text-sm">No Image Available</span>
                </div>
              )}
            </div>
            <div
              className={`bg-white ${
                isLgScreen
                  ? "w-full h-[130px] px-[10px] py-[20px] gap-[8px]"
                  : "lg:w-full lg:h-[122px] lg:px-[14px] lg:py-[28px] lg:gap-[10px] p-2 gap-1.5 h-[56px]"
              } overflow-hidden rounded-b-[6px] flex flex-col absolute bottom-0 left-0 right-0 items-start`}
            >
              <h2
                className={`${
                  isLgScreen ? "text-lg" : "lg:text-xl text-sm"
                } font-semibold text-grey-800 truncate w-full`}
              >
                {item.title}
              </h2>
              <p className={`text-grey-600 ${isLgScreen ? "text-xs" : "lg:text-sm text-xs"} truncate w-full`}>
                {item.addr1 || "Address not available"}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
