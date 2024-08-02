"use client";

import { Comments } from "@/types/Comments.types";
import React from "react";
import DetailPagePagination from "../DetailPagePagination";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comments[];
  totalPages: number;
  currentPage: number;
  userId: string | null;
  editCommentId: string | null;
  newComment: string;
  onEdit: (comment: Comments) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string) => void;
  onCancel: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  totalPages,
  currentPage,
  userId,
  editCommentId,
  newComment,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  onChange,
  setPage,
}) => {
  return (
    <div className="mt-4 max-w-[1440px] mx-auto">
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.comment_id ? comment.comment_id : `comment-${index}`}
          comment={comment}
          userId={userId}
          editCommentId={editCommentId}
          newComment={newComment}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onCancel={onCancel}
          onChange={onChange}
        />
      ))}
      <DetailPagePagination totalPages={totalPages} page={currentPage} setPage={setPage} />
    </div>
  );
};

export default CommentList;
