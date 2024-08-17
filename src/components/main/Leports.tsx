"use Client";

import { useModal } from "@/context/modal.context";
import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { MainListTitle } from "../common/MainListTitle";

const supabase = createClient();

interface TravelProps {
  searchTerm: string;
}

interface ContextType {
  previousLikes: Likes[] | undefined;
}

const FetchLeports = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/tourism/leports");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const Leports: React.FC<TravelProps> = ({ searchTerm }) => {
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const [displayCount, setDisplayCount] = useState<number>(20);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore();
  const modal = useModal();

  const {
    data: leports,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["leports"],
    queryFn: FetchLeports,
  });

  const sortedLeports: ApiInformation[] = useMemo(() => {
    if (!leports) return [];

    const filtered: ApiInformation[] = leports.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const shuffled: ApiInformation[] = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      })
      .slice(0, displayCount);
  }, [leports, displayCount, searchTerm]);

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
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>에러가 발생했습니다</p>
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

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["likes", variables?.content_id] });

      if (error) {
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>좋아요 등록 중 에러가 발생했습니다.</p>
              <p>{error.message}</p>
            </div>
          ),
        });
      } else {
      }
    },
    onSuccess: (data) => {
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>장소가 나의 공간에</p>
            <p>추가되었습니다.</p>
          </div>
        ),
      });

      queryClient.invalidateQueries({ queryKey: ["likes", data.content_id] });
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
      const contentId = event.currentTarget.getAttribute("data-contentid");

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
          await supabase.from("Likes").delete().match({ user_id: userId, content_id: contentId });
          setLikedStates((prevStates) => ({
            ...prevStates,
            [contentId]: false,
          }));
        } else {
          const item = sortedLeports.find((item) => item.contentid === contentId);
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

          setLikedStates((prevStates) => ({
            ...prevStates,
            [contentId]: true,
          }));
        }
      } catch (error) {
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>좋아요 상태 업데이트를 실패했습니다.</p>
            </div>
          ),
        });
      }
    },
    [likedStates, addMutation, sortedLeports, userId, modal],
  );

  useEffect(() => {
    if (leports) {
      const fetchLikes = async () => {
        const { data: likes } = await supabase
          .from("Likes")
          .select("*")
          .in(
            "content_id",
            leports.map((item) => item.contentid),
          );
        const newLikedStates = leports.reduce((acc, item) => {
          const result = likes?.find((like) => like.user_id === userId && like.content_id === item.contentid);
          acc[item.contentid] = !!result;
          return acc;
        }, {} as Record<string, boolean>);
        setLikedStates(newLikedStates);
      };
      fetchLikes();
    }
  }, [leports, userId]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!sortedLeports.length) return null;

  return (
    <>
      <div className="mx-auto py-8 max-w-[327px] lg:max-w-[1440px] flex flex-col gap-10">
        <MainListTitle TitleName={`놀거리 추천`} onClick={() => router.push("/leports")} />
      </div>
      <div className="mx-auto max-w-[327px] lg:max-w-[1440px]">
        <div className="lg:flex lg:gap-10 lg:h-[712px]">
          {sortedLeports.length > 0 && (
            <Swiper
              modules={[Grid, A11y, Autoplay]}
              spaceBetween={20}
              breakpoints={{
                1024: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 3,
                },
              }}
              grid={{
                rows: 2,
                fill: "row",
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded-[8px] lg:h-full lg:w-[708px] h-[346px] w-full flex flex-col items-start gap-3 self-stretch mb-5"
              observer={true}
              observeParents={true}
              onInit={(swiper) => {
                setTimeout(() => {
                  swiper.update();
                }, 0);
              }}
            >
              {sortedLeports.map((item: ApiInformation) => (
                <SwiperSlide key={item.contentid} className="h-[166px] lg:h-[346px]">
                  <div
                    className="lg:w-[330px] lg:h-[346px] w-[104px] h-[166px] relative cursor-pointer rounded-[8px] transition-transform duration-300 hover:scale-105"
                    onClick={() => router.push(`/detail/${item.contentid}`)}
                  >
                    <div className="h-[110px] lg:h-[224px] relative rounded-t-[8px] overflow-hidden">
                      {item.firstimage ? (
                        <Image
                          src={item.firstimage}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-[8px]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[8px]">
                          <span className="text-gray-500 text-xs lg:text-sm">No Image</span>
                        </div>
                      )}
                      <button
                        data-contentid={item.contentid}
                        onClick={(event) => handleLikeButton(event)}
                        disabled={!userId}
                        className="absolute top-2 right-2"
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
                    <div className="bg-white w-full h-[56px] lg:h-[122px] overflow-hidden rounded-b-[8px] p-2 lg:px-[14px] lg:py-[28px] flex flex-col gap-1 lg:gap-[10px] absolute bottom-0 left-0 right-0 items-start">
                      <h2 className="text-sm lg:text-xl font-semibold text-gray-800 truncate w-full">{item.title}</h2>
                      <p className="text-gray-600 text-xs lg:text-sm truncate w-full">
                        {item.addr1 || "Address not available"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="flex flex-col lg:gap-6 gap-5 lg:w-[708px] lg:h-full w-full">
            <div className="lg:h-[590px] lg:w-[708px]  h-[260px] w-[327px] relative rounded-[8px] overflow-hidden">
              <Image
                src="/assets/images/ex4.png"
                alt="profile"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
            <div className="lg:h-[94px] lg:w-[708px] h-[42px] w-[327px] relative rounded-[8px] overflow-hidden">
              <Image
                src="/assets/images/ex5.png"
                alt="profile"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
