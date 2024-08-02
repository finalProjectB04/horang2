"use client";

import { Comments } from "@/types/Comments.types";
import Image from "next/image";
import React from "react";

interface CommentItemProps {
  comment: Comments;
  userId: string | null;
  editCommentId: string | null;
  newComment: string;
  onEdit: (comment: Comments) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string) => void;
  onCancel: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userId,
  editCommentId,
  newComment,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  onChange,
}) => {
  return (
    <div className="p-4 border border-grey-100 rounded-xl flex flex-col items-start mx-auto mb-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Image src="/assets/images/profile_ex.png" alt="유저 프로필 사진" width={45} height={45} className="mr-4" />
          <div>
            <h1 className="text-2xl text-grey-700 font-bold py-2">{comment.user_email} 님</h1>
            <h2 className="py-2 text-grey-700">{comment.created_at}</h2>
          </div>
        </div>
        {userId === comment.user_id && (
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => onEdit(comment)}
              className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(comment.comment_id)}
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
              onChange={onChange}
              className="w-full p-2 border rounded break-all"
              style={{ wordBreak: "break-all" }}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => onUpdate(comment.comment_id)}
                className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
              >
                저장
              </button>
              <button
                onClick={onCancel}
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
  );
};

export default CommentItem;
