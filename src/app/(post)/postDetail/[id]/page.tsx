"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { selectPostById } from "@/components/posting/select/route";
import { updatePost } from "@/components/posting/update/route";
import { deletePost } from "@/components/posting/delete/route";
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
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedFile, setEditedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await selectPostById(id as string);
        setPost(fetchedPost);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

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

  if (isLoading) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isError || !post) {
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
      files: editedFile,
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
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={10}
          />
          <input
            type="text"
            value={editedFile || ""}
            onChange={(e) => setEditedFile(e.target.value)}
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
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
            수정
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            삭제
          </button>
        </div>
      )}
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetail;
