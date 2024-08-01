"use client";

import { Comments } from "@/types/Comments.types";
import { fetchSessionData } from "@/utils/fetchSession";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
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

  const {
    data: sessionData,
    isPending: pendingSessionData,
    error: sessionError,
  } = useQuery<Session | null, Error, Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

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

      alert("댓글 작성이 성공했습니다.");
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
  });

  const handleUpdate = async (commentId: string) => {
    updateCommentMutation.mutate(commentId);
  };

  const handleDelete = async (commentId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          alert("삭제가 완료되었습니다.");
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

  if (pendingSessionData || pendingComments) {
    return <div>불러오는중...</div>;
  }

  if (sessionError) {
    return <h1>사용자 정보에서 에러가 발생했습니다: {sessionError.message}</h1>;
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Image
                  src="/assets/images/profile_ex.png"
                  alt="유저 프로필 사진"
                  width={45}
                  height={45}
                  className="mr-4"
                />
                <div>
                  <h1 className="text-2xl text-grey-700 font-bold py-2">{comment.user_email} 님</h1>
                  <h2 className="py-2 text-grey-700">{comment.created_at}</h2>
                </div>
              </div>
              {sessionData && sessionData.user.id === comment.user_id && (
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 w-full">
              {editCommentId === comment.comment_id ? (
                <div>
                  <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="w-full p-2 border rounded break-all"
                    style={{ wordBreak: "break-all" }}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleUpdate(comment.comment_id)}
                      className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditCommentId(null)}
                      className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="py-2 break-all whitespace-pre-wrap pl-14 text-grey-700">{comment.comment}</p>
              )}
            </div>
          </div>
        ))}
      <DetailPagePagination totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  );
};

export default DetailPageCommentList;
