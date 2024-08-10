"use client";

import { Comments } from "@/types/Comments.types";

import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "./../../utils/detailpage/formDateUtil";
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
    },
    onError: (error: Error) => {
      console.error("댓글 작성 실패:", error.message);
      alert(`댓글 작성 실패: ${error.message}`);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("Comments").delete().eq("comment_id", commentId).single();
    },
    onSuccess: () => {},
    onError: (error: Error) => {
      console.error("댓글 삭제 실패:", error.message);
      alert(`댓글 삭제 실패: ${error.message}`);
    },
  });

  const handleUpdate = async (commentId: string) => {
    if (confirm("정말 수정하시겠습니까?")) {
      updateCommentMutation.mutate(commentId, {
        onSuccess: () => {
          alert("수정이 완료되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
        },
      });
    } else {
      alert("수정이 취소되었습니다.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          alert("삭제가 완료되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
        },
      });
    } else {
      alert("삭제가 취소되었습니다.");
    }
  };

  const handleEdit = (comment: Comments) => {
    setEditCommentId(comment.comment_id);
    setNewComment(comment.comment || "");
  };

  const handleCancelEdit = () => {
    if (confirm("정말 취소하시겠습니까?")) {
      setEditCommentId(null);
      setNewComment("");
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
    <div className="sm:mt-4 sm:max-w-[375px] sm:mx-auto md:mt-4 md:max-w-[1024px] md:mx-auto lg:mt-4 lg:max-w-[1440px] lg:mx-auto">
      {commentsData?.comments &&
        commentsData.comments.map((comment: Comments, index) => (
          <div
            className="sm:p-3 sm:border-none sm:border-grey-100 sm:rounded-lg sm:flex sm:flex-col sm:items-start sm:mx-auto sm:mb-[1px] sm:w-full md:p-4 md:border md:border-grey-100 md:rounded-xl md:flex md:flex-col md:items-start md:mx-auto md:mb-[1px] md:w-full lg:p-4 lg:border lg:border-grey-100 lg:rounded-xl lg:flex lg:flex-col lg:items-start lg:mx-auto lg:mb-[1px] lg:w-full"
            key={comment.comment_id ? comment.comment_id : `comment-${index}`}
          >
            <div className="sm:flex sm:items-center sm:justify-between sm:w-full sm:py-3 md:flex md:items-center md:justify-between md:w-full md:py-5 lg:flex lg:items-center lg:justify-between lg:w-full lg:py-5">
              <div className="sm:flex sm:items-center md:flex md:items-center md:ps-10 lg:flex lg:items-center lg:ps-10">
                <Image
                  src={comment.user_profile_url || "/assets/images/profile_ex.png"}
                  alt="유저 프로필 사진"
                  width={40}
                  height={40}
                  className="sm:mr-3 sm:w-[48px] sm:h-[48px] md:mr-4 lg:mr-4"
                />
                <div>
                  <h1 className="sm:text-[17px] sm:text-secondary-800 sm:font-bold sm:py-2 sm:ps-2 md:text-[24px] md:text-grey-700 md:font-bold md:py-2 md:ps-3 lg:text-[28px] lg:text-grey-700 lg:font-bold lg:py-2 lg:ps-3">
                    {comment.user_nickname || comment.user_email} 님
                  </h1>
                  <h2 className="sm:py-1 sm:text-grey-600 sm:text-[10px] sm:ps-2 sm:font-normal md:py-1 md:text-grey-600 md:text-[16px] md:ps-3 lg:py-1 lg:text-grey-600 lg:text-[18px] lg:ps-3">
                    {comment.created_at ? formatDate(comment.created_at) : "날짜 정보 없음"}
                  </h2>
                </div>
              </div>
              {userId === comment.user_id && editCommentId !== comment.comment_id && (
                <div className="sm:flex sm:space-x-2 sm:justify-end md:flex md:space-x-2 md:justify-end md:pr-[95px] lg:flex lg:space-x-2 lg:justify-end lg:pr-[95px]">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="sm:flex sm:justify-center sm:items-center sm:h-[30px] sm:py-0 sm:px-[16px] sm:text-[14px] sm:text-grey-600 sm:font-normal sm:rounded md:flex md:justify-center md:items-center md:h-[36px] md:pb-7 md:py-0 md:px-[26px] md:text-[16px] md:text-grey-600 md:font-normal md:rounded lg:flex lg:pb-7 lg:justify-center lg:items-center lg:h-[36px] lg:py-0 lg:px-[26px] lg:text-[18px] lg:text-grey-600 lg:font-normal lg:rounded"
                  >
                    <Image
                      src="/assets/images/detailpage/Mode_edit.svg"
                      alt="수정"
                      width={16}
                      height={16}
                      className="sm:block md:hidden lg:hidden"
                    />
                    <span className="sm:hidden">수정</span>
                  </button>
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    className="sm:flex sm:justify-center sm:items-center sm:h-[30px] sm:py-0 sm:px-[16px] sm:text-[14px] sm:text-grey-600 sm:font-normal sm:rounded md:flex md:justify-center md:items-center md:h-[36px] md:pb-7 md:py-0 md:px-[26px] md:rounded md:text-[16px] md:text-grey-600 md:font-normal lg:flex lg:pb-7 lg:justify-center lg:items-center lg:h-[36px] lg:py-0 lg:px-[26px] lg:rounded lg:text-[18px] lg:text-grey-600 lg:font-normal"
                  >
                    <Image
                      src="/assets/images/detailpage/Delete.svg"
                      alt="삭제"
                      width={16}
                      height={16}
                      className="sm:block md:hidden lg:hidden"
                    />
                    <span className="sm:hidden">삭제</span>
                  </button>
                </div>
              )}
            </div>
            <div className="sm:mt-2 sm:w-full md:mt-2 md:w-full lg:mt-2 lg:w-full">
              {editCommentId === comment.comment_id ? (
                <div className="sm:ps-[48px] md:ps-[129px] lg:ps-[129px]">
                  <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="sm:w-full sm:p-2 sm:border sm:rounded-[20px] sm:bg-grey-100 sm:break-all sm:text-[12px] sm:max-w-[280px] sm:text-grey-600 md:w-full md:p-2 md:border md:rounded md:break-all md:text-[24px] md:max-w-[800px] md:text-grey-700 lg:w-full lg:p-2 lg:border lg:rounded lg:break-all lg:text-[28px] lg:max-w-[1200px] lg:text-grey-700"
                    style={{ wordBreak: "break-all" }}
                  />
                  <div className="sm:flex sm:justify-end sm:space-x-2 sm:mt-2 sm:pr-[20px] md:flex md:justify-end md:space-x-2 md:mt-2 md:pr-[95px] lg:flex lg:justify-end lg:space-x-2 lg:mt-2 lg:pr-[95px]">
                    <button
                      onClick={() => handleUpdate(comment.comment_id)}
                      className="sm:flex sm:justify-center sm:items-center sm:h-[30px] sm:py-0 sm:px-[16px] sm:text-[14px] sm:text-grey-600 sm:font-normal sm:rounded md:flex md:justify-center md:items-center md:h-[36px] md:py-0 md:px-[26px] md:text-[16px] md:text-grey-600 md:font-normal md:rounded lg:flex lg:justify-center lg:items-center lg:h-[36px] lg:py-0 lg:px-[26px] lg:text-[18px] lg:text-grey-600 lg:font-normal lg:rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="sm:flex sm:justify-center sm:items-center sm:h-[30px] sm:py-0 sm:px-[16px] sm:text-[14px] sm:text-grey-600 sm:font-normal sm:rounded md:flex md:justify-center md:items-center md:h-[36px] md:py-0 md:px-[26px] md:text-[16px] md:text-grey-600 md:font-normal md:rounded lg:flex lg:justify-center lg:items-center lg:h-[36px] lg:py-0 lg:px-[26px] lg:text-[18px] lg:text-grey-600 lg:font-normal lg:rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="sm:ps-[48px] sm:pl-[65px] sm:mb-2 sm:pb-2 sm:break-all sm:whitespace-pre-wrap sm:pr-[20px] sm:text-grey-600 sm:text-[12px] md:ps-[105px] md:mb-8 md:pb-5 md:break-all md:whitespace-pre-wrap md:pr-[70px] md:text-grey-700 md:text-[24px] lg:ps-[105px] lg:mb-8 lg:pb-5 lg:break-all lg:whitespace-pre-wrap lg:pr-[95px] lg:text-grey-700 lg:text-[28px]">
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
