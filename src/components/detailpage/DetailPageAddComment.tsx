"use client";

import { fetchSessionData } from "@/utils/fetchSession";
import { supabase } from "@/utils/supabase/clientSsr";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

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
          <span className="text-2xl font-bold ml-2">{sessionData.user.email} 님</span>
        </div>
      )}
      <div className="p-4 border border-orange-300 rounded-lg flex items-center bg-gray-100">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full p-2 rounded-l-lg resize-none bg-gray-100 ${
            !userId ? "text-gray-500" : "text-gray-900"
          } border-none flex-grow`}
          disabled={!userId}
          maxLength={1000}
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-3 py-4 fold-bold bg-orange-300 text-red-800 rounded-lg border border-gray-300 hover:bg-orange-600"
          disabled={!userId}
          style={{ width: "90px" }}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddComment;
