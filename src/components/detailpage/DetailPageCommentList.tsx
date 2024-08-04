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
    <div className="mt-4 max-w-[1440px] mx-auto">
      {commentsData?.comments &&
        commentsData.comments.map((comment: Comments, index) => (
          <div
            className="p-4 border border-grey-100 rounded-xl flex flex-col items-start mx-auto mb-4 w-full"
            key={comment.comment_id ? comment.comment_id : `comment-${index}`}
          >
            <div className="flex items-center justify-between w-full py-5">
              <div className="flex items-center ps-10">
                <Image
                  src={comment.user_profile_url || "/assets/images/profile_ex.png"}
                  alt="유저 프로필 사진"
                  width={64}
                  height={64}
                  className="mr-4"
                />
                <div>
                  <h1 className="text-[28px] text-grey-700 font-bold py-2 ps-3">
                    {comment.user_nickname || comment.user_email} 님
                  </h1>
                  <h2 className="py-1 text-grey-600 text-[18px] ps-3">{formatDate(comment.created_at)}</h2>
                </div>
              </div>
              {userId === comment.user_id && editCommentId !== comment.comment_id && (
                <div className="flex space-x-2 justify-end pr-[95px]">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="flex justify-center items-center h-[36px] py-0 px-[26px] text-[18px] text-grey-600 font-normal rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    className="flex justify-center items-center h-[36px] py-0 px-[26px] rounded text-[18px] text-grey-600 font-normal"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 w-full">
              {editCommentId === comment.comment_id ? (
                <div className="ps-[129px]">
                  <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="w-full p-2 border rounded break-all text-[28px] max-w-[1200px] text-grey-700"
                    style={{ wordBreak: "break-all" }}
                  />
                  <div className="flex justify-end space-x-2 mt-2 pr-[95px]">
                    <button
                      onClick={() => handleUpdate(comment.comment_id)}
                      className="flex justify-center items-center h-[36px] py-0 px-[26px] text-[18px] text-grey-600 font-normal rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex justify-center items-center h-[36px] py-0 px-[26px] text-[18px] text-grey-600 font-normal rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="ps-[129px] mb-8 pb-5 break-all whitespace-pre-wrap pr-[95px] text-grey-700 text-[28px]">
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
