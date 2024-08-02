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
// Swiper 스타일 import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CommentSection from "@/components/common/comments/CommentSection";
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
  const getImageUrls = (files: string | null): string[] => {
    return files ? files.split(",").filter((url) => url.trim() !== "") : [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
        뒤로 가기
      </button>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-sm text-gray-500">
        <span>작성자: {post.user_id}</span>
        <span className="ml-4">
          작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}
        </span>
      </div>
      {post.files && (
        <div className="mb-4">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-[400px]"
          >
            {getImageUrls(post.files).map((url, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image src={url} alt={`게시물 이미지 ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
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
            className="w-full p-2 border rounded mb-2"
            rows={10}
          />
          <input
            type="text"
            value={editedFile || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedFile(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="파일 URL (쉼표로 구분하여 여러 URL 입력 가능)"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            저장
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            취소
          </button>
        </div>
      ) : (
        <div>
          <div className="prose max-w-none mb-4">{post.content}</div>
          {sessionData && sessionData.user.id === post.user_id && (
            <div className="flex space-x-2 justify-end">
              <button onClick={handleEdit} className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded">
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetail;
