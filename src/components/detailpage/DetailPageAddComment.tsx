"use client";

import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { fetchSessionData } from "./../../utils/auth";
import CommentForm from "./addcomment/CommentForm";

const supabase = createClient();

interface DetailPageAddCommentProps {
  userId: string | null;
  contentId: string;
  contenTypeId: string;
  userEmail: string | undefined;
}

const DetailPageAddComment: React.FC<DetailPageAddCommentProps> = ({ userId, contentId, contenTypeId, userEmail }) => {
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();

  const {
    data: sessionData,
    isPending,
    error,
  } = useQuery<Session | null, Error, Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        console.log("User is not logged in. Comment cannot be added.");
        throw new Error("로그인 후 댓글을 작성할 수 있습니다.");
      }

      const response = await supabase.from("Comments").insert([
        {
          user_id: userId,
          content_id: contentId,
          comment,
          content_type_id: contenTypeId,
          user_email: userEmail,
        },
      ]);
    },
    onSuccess: () => {
      setComment("");
      alert("댓글 작성 성공!");
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
    onError: (error: Error) => {
      alert(`댓글 작성 실패: ${error.message}`);
    },
  });

  const handleAddComment = () => {
    addCommentMutation.mutate();
  };
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    console.log(`Error occurred: ${error.message}`);
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  return (
    <main className="mt-4 max-w-[1440px] mx-auto">
      {isPending && <div>프로필 정보를 불러오는 중...</div>}

      {sessionData && (
        <div className="flex items-center mb-4bg-gray-50 py-3">
          <Image src="/assets/images/profile_ex.png" alt="유저 프로필 사진" width={25} height={25} />
          <span className="text-2xl font-bold ml-2 text-grey-700">{sessionData.user.email} 님</span>
        </div>
      )}
      <CommentForm
        comment={comment}
        userId={userId}
        onCommentChange={handleCommentChange}
        onAddComment={handleAddComment}
      />
    </main>
  );
};

export default DetailPageAddComment;
