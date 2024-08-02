"use client";

import React from "react";

interface CommentFormProps {
  comment: string;
  userId: string | null;
  onCommentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddComment: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ comment, userId, onCommentChange, onAddComment }) => {
  return (
    <div className="p-4 border border-primary-100 rounded-xl flex items-center bg-grey-50 py-12">
      <textarea
        value={comment}
        onChange={onCommentChange}
        placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
        className={`w-full p-2 rounded-l-lg resize-none bg-grey-50 text-grey-700 ${
          !userId ? "text-grey-500" : "text-grey-900"
        } border-none flex-grow min-h-[80px] max-h-[500px]`}
        disabled={!userId}
        maxLength={1000}
      />
      <button
        onClick={onAddComment}
        className="mr-5 ml-2 px-4 py-4 text-xl font-black bg-primary-100 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-400"
        disabled={!userId}
        style={{ width: "100px" }}
      >
        등록
      </button>
    </div>
  );
};

export default CommentForm;
