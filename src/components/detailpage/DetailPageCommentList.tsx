"use client";

import { Comments } from "@/types/Comments.types";
import { fetchSessionData } from "@/utils/auth";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CommentList from "./commentlist/CommentList";

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
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
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
    <CommentList
      comments={commentsData?.comments || []}
      totalPages={totalPages}
      currentPage={page}
      userId={sessionData?.user?.id || null}
      editCommentId={editCommentId}
      newComment={newComment}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onCancel={() => setEditCommentId(null)}
      onChange={(event) => setNewComment(event.target.value)}
      setPage={setPage}
    />
  );
};

export default DetailPageCommentList;
