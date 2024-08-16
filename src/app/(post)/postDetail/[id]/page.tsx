"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { selectPostById } from "@/components/posting/select/route";
import { updatePost } from "@/components/posting/update/route";
import { deletePost } from "@/components/posting/delete/route";
import { fetchSessionData } from "@/utils/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CommentSection from "@/components/common/comments/CommentSection";
import { useUserStore } from "@/zustand/userStore";
import PostLike from "@/components/posting/postcomponents/PostLike";
import ShareModal from "@/components/detailpage/ShareModal";

interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
}

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedFile, setEditedFile] = useState<string | null>(null);
  const { user_nickname, profile_url } = useUserStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
  } = useQuery<Post | null, Error>({
    queryKey: ["post", id],
    queryFn: () => selectPostById(id),
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      console.error("Update failed:", error);
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      router.push("/community");
    },
  });

  if (isPendingPost || isPendingSession) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isPostError || !post || sessionError) {
    return <div className="text-center py-10 text-red-500">게시물을 불러오는 중 오류가 발생했습니다.</div>;
  }

  const handleEdit = () => {
    setEditedContent(post.content || "");
    setEditedTitle(post.title || "");
    setEditedFile(post.files);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: post.id,
      content: editedContent,
      title: editedTitle,
      file: editedFile,
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      deleteMutation.mutate(post.id);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const getImageUrls = (files: string | null): string[] => {
    return files ? files.split(",").filter((url) => url.trim() !== "") : [];
  };

  return (
    <div className="container mx-auto px-4 max-w-[959px]">
      <div className="mb-4">
        {post.files && (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-[500px] max-w-[1280px] mx-auto overflow-hidden"
          >
            {getImageUrls(post.files).map((url, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={url}
                    alt={`게시물 이미지 ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex items-center">
          <PostLike post_id={post.id} onLikesChange={() => {}} initialLikes={0} />
          <Image
            src="/assets/images/shareModal.svg"
            alt="공유하기"
            width={24}
            height={24}
            className="ml-4 cursor-pointer"
            onClick={handleShareClick}
          />
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-[30px] mb-[40px]">
        작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}
      </div>
      <div className="flex items-center mb-[40px]">
        <Image
          src={profile_url || "/path/to/default_profile_image.jpg"}
          alt="프로필 이미지"
          width={30}
          height={30}
          className="rounded-full"
        />
        <div className="ml-4">
          <p className="text-lg text-black">{user_nickname}</p>
        </div>
      </div>
      <div className="mb-40">
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon1.png" alt="여행 장소" width={24} height={24} />
          <p className="text-lg text-black ml-2">여행 장소 ㅣ null</p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon.png" alt="출발 장소" width={24} height={24} />
          <p className="text-lg text-black ml-2">출발 장소 ㅣ null</p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon2.png" alt="여행 비용" width={24} height={24} />
          <p className="text-lg text-black ml-2">여행 비용 ㅣ null</p>
        </div>
        <div className="flex items-center">
          <Image src="/assets/images/icon3.png" alt="여행 기간" width={24} height={24} />
          <p className="text-lg text-black ml-2">여행 기간 ㅣ null</p>
        </div>
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={editedContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded mb-2 resize-y"
            rows={10}
          />
          <input
            type="text"
            value={editedFile || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFile(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="파일 URL (쉼표로 구분하여 여러 URL 입력 가능)"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      ) : (
        <div>
          <div className="prose max-w-none mb-4" style={{ minHeight: "150px" }}>
            {post.content}
          </div>

          <div className="flex justify-between items-center">
            {sessionData && sessionData.user.id === post.user_id && (
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={handleEdit}
                  className="text-sm text-gray-700 hover:text-black"
                  style={{ padding: "8px 12px" }}
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-gray-700 hover:text-black"
                  style={{ padding: "8px 12px" }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <CommentSection postId={post.id} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default PostDetail;
