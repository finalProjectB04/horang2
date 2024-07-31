"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { selectPostById } from "@/components/posting/select/route";
import { updatePost } from "@/components/posting/update/route";
import { deletePost } from "@/components/posting/delete/route";
import CommentSection from "@/components/posting/comment/CommentSection";

// import CommentSection from "@/components/CommentSection";

interface Post {
  content: string | null;
  created_at: string | null;
  file: string | null;
  id: string;
  title: string | null;
  user_id: string;
}

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const {
    data: post,
    isPending,
    isError,
  } = useQuery<Post | null, Error>({
    queryKey: ["post", id],
    queryFn: () => selectPostById(id as string),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id as string] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      router.push("/community");
    },
  });

  if (isPending) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isError || !post) {
    return <div className="text-center py-10 text-red-500">게시물을 불러오는 중 오류가 발생했습니다.</div>;
  }

  const handleEdit = () => {
    setEditedContent(post.content || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: post.id, content: editedContent });
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
      {post.file && (
        <div className="mb-4">
          <Image src={post.file} alt="게시물 이미지" width={600} height={400} layout="responsive" />
        </div>
      )}
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={10}
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
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
            수정
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
