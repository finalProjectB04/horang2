"use client";

import { fetchSessionData } from "@/utils/fetchSession";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

interface DetailPageAddPostProps {
  userId: string | null;
  contentId: string;
  contenTypeId: string;
}

const DetailPageAddPost: React.FC<DetailPageAddPostProps> = ({ userId, contentId, contenTypeId }) => {
  const [comment, setComment] = useState("");
  const supabase = createClient();

  const {
    data: sessionData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData, //현재는 User테이블 정보 말고 세션을 읽어오고 있습니다.. 다음에는 유저 정보 테이블을 읽어올 예정입니다
  });

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  const handleAddComment = async () => {
    if (!userId) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    const { error } = await supabase
      .from("Comments")
      .insert([{ user_id: userId, content_id: contentId, comment, content_type_id: contenTypeId }]);
    if (error) {
      console.error("댓글 작성 실패:", error.message);
    } else {
      setComment("");
      alert("댓글 작성 성공!");
    }
    console.log("🚀 ~ handleAddComment ~ setComment:", setComment);
  };

  return (
    <main className="mt-4 max-w-4xl mx-auto">
      {isPending && <div>프로필 정보를 불러오는 중...</div>}

      {sessionData && (
        <div className="flex items-center mb-4">
          <Image src="/assets/images/profile_ex.png" alt="유저 프로필 사진" width={25} height={25} />
          <span className="ml-2">{sessionData.user.email} 님</span>
        </div>
      )}
      <div className="p-4 border border-orange-300 rounded-lg flex items-center">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full p-2 rounded-l-lg resize-none ${
            !userId ? "bg-gray-200 text-gray-500" : "bg-white text-black"
          } border-none flex-grow`}
          disabled={!userId}
          maxLength={200}
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-2 py-3 bg-orange-500 text-white rounded-lg border border-gray-300 hover:bg-orange-600"
          disabled={!userId}
          style={{ width: "90px" }}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddPost;
