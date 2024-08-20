"use client";

import PostHeader from "@/components/common/postdetail/PostHeader";
import PostContent from "@/components/common/postdetail/PostContent";

import CommentSection from "@/components/common/comments/CommentSection";
import ShareModal from "@/components/detailpage/share/ShareModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSessionData } from "@/utils/auth";
import { selectPostById } from "@/components/posting/select/route";
import { useUserStore } from "@/zustand/userStore";
import { useModal } from "@/context/modal.context";

interface Post {
  id: string;
  content: string | null;
  title: string | null;
  files: string | null;
  created_at: string | null;
  user_id: string;
  place?: string | null;
  departure?: string | null;
  cost?: string | null;
  period?: string | null;
  user_nickname?: string | null;
}

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user_nickname, profile_url } = useUserStore();
  const modal = useModal();

  const {
    data: sessionData,
    isPending: isPendingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ["sessionData"],
    queryFn: fetchSessionData,
  });

  const {
    data: post,
    isPending: isPendingPost,
    isError: isPostError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => selectPostById(id),
  });

  if (isPendingPost || isPendingSession) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isPostError || !post || sessionError) {
    return <div className="text-center py-10 text-red-500">게시물을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-0 max-w-[960px]">
      <PostHeader
        post={post}
        sessionData={sessionData}
        userNickname={user_nickname || "Unknown User"}
        profileUrl={profile_url}
        onShareClick={() => setIsShareModalOpen(true)}
      />

      <PostContent post={post} sessionData={sessionData} />

      <CommentSection postId={post.id} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default PostDetail;
