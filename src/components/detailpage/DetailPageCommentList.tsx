"use client";

import { Comments } from "@/types/Comments.types";

import { useModal } from "@/context/modal.context";
import { formatDate } from "@/utils/detailpage/formDateUtil";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

import useCustomConfirm from "@/hooks/useCustomConfirm";
import DetailPagePagination from "./DetailPagePagination";

const supabase = createClient();

interface DetailPageCommentListProps {
  contentId: string;
}

interface CommentsResponse {
  comments: Comments[];
  totalCount: number | null;
}
const ITEMS_PER_PAGE = 4;

const DetailPageCommentList: React.FC<DetailPageCommentListProps> = ({ contentId }) => {
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { id: userId, user_email: userEmail, user_nickname: userNickname, profile_url: profileUrl } = useUserStore();
  const queryClient = useQueryClient();
  const modal = useModal();
  const confirm = useCustomConfirm();

  const {
    data: commentsData,
    isPending: pendingComments,
    error: commentError,
  } = useQuery<CommentsResponse, Error, CommentsResponse>({
    queryKey: ["comments", contentId, page],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("Comments")
        .select("*", { count: "exact" })
        .eq("content_id", contentId)
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) throw new Error(error.message);
      return { comments: data, totalCount: count };
    },
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const updateCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("Comments").update({ comment: newComment }).eq("comment_id", commentId).single();
    },
    onSuccess: () => {
      setEditCommentId(null);
      setNewComment("");
      modal.open({
        title: "성공!",
        content: (
          <div className="text-center">
            <p>댓글 수정이 성공했습니다.</p>
          </div>
        ),
      });
    },
    onError: (error: Error) => {
      modal.open({
        title: "에러!",
        content: (
          <div className="text-center">
            <p>에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("Comments").delete().eq("comment_id", commentId).single();
    },
    onSuccess: () => {
      modal.open({
        title: "성공!",
        content: (
          <div className="text-center">
            <p>댓글 삭제가 성공했습니다.</p>
          </div>
        ),
      });
    },
    onError: (error: Error) => {
      modal.open({
        title: "에러!",
        content: (
          <div className="text-center">
            <p>댓글 삭제가 실패했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
    },
  });

  const handleUpdate = async (commentId: string) => {
    const confirmed = await confirm("정말 수정하시겠습니까?");
    if (confirmed) {
      updateCommentMutation.mutate(commentId, {
        onSuccess: () => {
          modal.open({
            title: "성공!",
            content: (
              <div className="text-center">
                <p>댓글 수정이 완료되었습니다.</p>
              </div>
            ),
          });
          queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
        },
      });
    } else {
      modal.open({
        title: "알림!",
        content: (
          <div className="text-center">
            <p>댓글 수정이 취소되었습니다.</p>
          </div>
        ),
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = await confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          modal.open({
            title: "성공!",
            content: (
              <div className="text-center">
                <p>댓글 삭제가 성공했습니다.</p>
              </div>
            ),
          });
          queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
        },
      });
    } else {
      modal.open({
        title: "알림!",
        content: (
          <div className="text-center">
            <p>댓글 삭제를 취소했습니다.</p>
          </div>
        ),
      });
    }
  };

  const handleEdit = (comment: Comments) => {
    setEditCommentId(comment.comment_id);
    setNewComment(comment.comment || "");
  };

  const handleCancelEdit = async () => {
    const confirmed = await confirm("정말 취소하시겠습니까?");
    if (confirmed) {
      setEditCommentId(null);
      setNewComment("");
      modal.open({
        title: "알림!",
        content: (
          <div className="text-center">
            <p>댓글 수정을 취소했습니다.</p>
          </div>
        ),
      });
    }
  };

  if (pendingComments) {
    return <div>불러오는중...</div>;
  }

  if (commentError) {
    return <h1>댓글 목록에서 에러가 발생했습니다: {commentError.message}</h1>;
  }

  const totalPages = Math.ceil((commentsData?.totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <div className="tablet:mt-4 tablet:max-w-[1024px] tablet:mx-auto desktop:mt-4 desktop:max-w-[1440px] desktop:mx-auto">
      {commentsData?.comments &&
        commentsData.comments.map((comment: Comments, index) => (
          <div
            className="tablet:p-4 tablet:border tablet:border-grey-100 tablet:rounded-xl tablet:flex tablet:flex-col tablet:items-start tablet:mx-auto tablet:mb-[33px] tablet:w-full desktop:p-4 desktop:border desktop:border-grey-100 desktop:rounded-xl desktop:flex desktop:flex-col desktop:items-start desktop:mx-auto desktop:mb-[33px] desktop:w-full"
            key={comment.comment_id ? comment.comment_id : `comment-${index}`}
          >
            <div className="tablet:flex tablet:items-center tablet:justify-between tablet:w-full tablet:py-5 desktop:flex desktop:items-center desktop:justify-between desktop:w-full desktop:py-5">
              <div className="tablet:flex tablet:items-center tablet:ps-10 desktop:flex desktop:items-center desktop:ps-10">
                <Image
                  src={comment.user_profile_url || "/assets/images/profile_ex.png"}
                  alt="유저 프로필 사진"
                  width={64}
                  height={64}
                  className="tablet:mr-4 desktop:mr-4"
                />
                <div>
                  <h1 className="tablet:text-[24px] tablet:text-grey-700 tablet:font-bold tablet:py-2 tablet:ps-3 desktop:text-[28px] desktop:text-grey-700 desktop:font-bold desktop:py-2 desktop:ps-3">
                    {comment.user_nickname || comment.user_email} 님
                  </h1>
                  <h2 className="tablet:py-1 tablet:text-grey-600 tablet:text-[16px] tablet:ps-3 desktop:py-1 desktop:text-grey-600 desktop:text-[18px] desktop:ps-3">
                    {comment.created_at ? formatDate(comment.created_at) : "날짜 정보 없음"}
                  </h2>
                </div>
              </div>
              {userId === comment.user_id && editCommentId !== comment.comment_id && (
                <div className="tablet:flex tablet:space-x-2 tablet:justify-end tablet:pr-[95px] desktop:flex desktop:space-x-2 desktop:justify-end desktop:pr-[95px]">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="tablet:flex tablet:justify-center tablet:items-center tablet:h-[36px] tablet:pb-7 tablet:py-0 tablet:px-[26px] tablet:text-[16px] tablet:text-grey-600 tablet:font-normal tablet:rounded desktop:flex desktop:pb-7 desktop:justify-center desktop:items-center desktop:h-[36px] desktop:py-0 desktop:px-[26px] desktop:text-[18px] desktop:text-grey-600 desktop:font-normal desktop:rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    className="tablet:flex tablet:justify-center tablet:items-center tablet:h-[36px] tablet:pb-7 tablet:py-0 tablet:px-[26px] tablet:rounded tablet:text-[16px] tablet:text-grey-600 tablet:font-normal desktop:flex desktop:pb-7 desktop:justify-center desktop:items-center desktop:h-[36px] desktop:py-0 desktop:px-[26px] desktop:rounded desktop:text-[18px] desktop:text-grey-600 desktop:font-normal"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div className="tablet:mt-2 tablet:w-full desktop:mt-2 desktop:w-full">
              {editCommentId === comment.comment_id ? (
                <div className="tablet:ps-[129px] desktop:ps-[129px]">
                  <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="tablet:w-full tablet:p-2 tablet:border tablet:rounded tablet:break-all tablet:text-[24px] tablet:max-w-[800px] tablet:text-grey-700 desktop:w-full desktop:p-2 desktop:border desktop:rounded desktop:break-all desktop:text-[28px] desktop:max-w-[1200px] desktop:text-grey-700"
                    style={{ wordBreak: "break-all" }}
                  />
                  <div className="tablet:flex tablet:justify-end tablet:space-x-2 tablet:mt-2 tablet:pr-[95px] desktop:flex desktop:justify-end desktop:space-x-2 desktop:mt-2 desktop:pr-[95px]">
                    <button
                      onClick={() => handleUpdate(comment.comment_id)}
                      className="tablet:flex tablet:justify-center tablet:items-center tablet:h-[36px] tablet:py-0 tablet:px-[26px] tablet:text-[16px] tablet:text-grey-600 tablet:font-normal tablet:rounded desktop:flex desktop:justify-center desktop:items-center desktop:h-[36px] desktop:py-0 desktop:px-[26px] desktop:text-[18px] desktop:text-grey-600 desktop:font-normal desktop:rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="tablet:flex tablet:justify-center tablet:items-center tablet:h-[36px] tablet:py-0 tablet:px-[26px] tablet:text-[16px] tablet:text-grey-600 tablet:font-normal tablet:rounded desktop:flex desktop:justify-center desktop:items-center desktop:h-[36px] desktop:py-0 desktop:px-[26px] desktop:text-[18px] desktop:text-grey-600 desktop:font-normal desktop:rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="tablet:ps-[129px] tablet:mb-8 tablet:pb-5 tablet:break-all tablet:whitespace-pre-wrap tablet:pr-[70px] tablet:text-grey-700 tablet:text-[24px] desktop:ps-[129px] desktop:mb-8 desktop:pb-5 desktop:break-all desktop:whitespace-pre-wrap desktop:pr-[95px] desktop:text-grey-700 desktop:text-[28px]">
                  {comment.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      <DetailPagePagination totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  );
};

export default DetailPageCommentList;
