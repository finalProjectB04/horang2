"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { selectPostById } from "@/components/posting/select/route";
import { updatePost } from "@/components/posting/update/route";
import { deletePost } from "@/components/posting/delete/route";
import { fetchSessionData } from "@/utils/auth";

interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
}

interface Session {
  user: {
    id: string;
  };
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
    isLoading: isPendingSession,
    error: sessionError,
  } = useQuery<Session, Error>({
    queryKey: ["sessionData"],
    queryFn: fetchSessionData,
  });

  const {
    data: post,
    isLoading: isPendingPost,
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
          <Image src={post.files} alt="게시물 이미지" width={600} height={400} layout="responsive" />
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
            placeholder="파일 URL"
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
    </div>
  );
};

export default PostDetail;
