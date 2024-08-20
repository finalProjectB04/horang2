"use client";

import CommentSection from "@/components/common/comments/CommentSection";
import ShareModal from "@/components/detailpage/share/ShareModal";
import PostLike from "@/components/posting/postcomponents/PostLike";
import { selectPostById } from "@/components/posting/select/route";
import { updatePost } from "@/components/posting/update/route";
import { useModal } from "@/context/modal.context";
import { fetchSessionData } from "@/utils/auth";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
}

const supabase = createClient();

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
  } = useQuery<Post | null, Error>({
    queryKey: ["post", id],
    queryFn: () => selectPostById(id),
  });

  const deletePostWithComments = async (postId: string) => {
    const { data: comments, error: commentsError } = await supabase
      .from("Post_comments")
      .select("post_comment_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (commentsError) {
      modal.open({
        title: "에러",
        content: <div className="text-center">댓글을 불러오는 중 오류가 발생했습니다.</div>,
      });
      throw new Error(commentsError.message);
    }

    const commentIds = comments.map((comment) => comment.post_comment_id);

    const { error: repliesError } = await supabase
      .from("Post_commentreplies")
      .delete()
      .in("parent_comment_id", commentIds);

    if (repliesError) {
      modal.open({
        title: "에러",
        content: <div className="text-center">대댓글 삭제 중 오류가 발생했습니다.</div>,
      });
      throw new Error(repliesError.message);
    }

    const { error: deleteCommentsError } = await supabase.from("Post_comments").delete().eq("post_id", postId);

    if (deleteCommentsError) {
      modal.open({
        title: "에러",
        content: <div className="text-center">댓글 삭제 중 오류가 발생했습니다.</div>,
      });
      throw new Error(deleteCommentsError.message);
    }

    const { error: deletePostError } = await supabase.from("Post").delete().eq("id", postId);

    if (deletePostError) {
      modal.open({
        title: "에러",
        content: <div className="text-center">게시물 삭제 중 오류가 발생했습니다.</div>,
      });
      throw new Error(deletePostError.message);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await deletePostWithComments(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/community");
    },
    onError: (error: Error) => {
      modal.open({
        title: "삭제 실패",
        content: <div className="text-center">삭제에 실패했습니다. 다시 시도해주세요.</div>,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPost: { id: string; content: string; title: string; file: string | null }) => {
      await updatePost(updatedPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      modal.open({
        title: "수정 실패",
        content: <div className="text-center">수정에 실패했습니다. 다시 시도해주세요.</div>,
      });
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
    modal.open({
      title: "삭제 확인",
      content: (
        <div className="text-center">
          <p>정말로 이 게시물을 삭제하시겠습니까?</p>
          <button
            onClick={() => {
              deleteMutation.mutate(post.id);
              modal.close();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            삭제
          </button>
        </div>
      ),
    });
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const getImageUrls = (files: string | null): string[] => {
    return files ? files.split(",").filter((url) => url.trim() !== "") : [];
  };

  return (
    <div className="container mx-auto px-4 sm:px-0 max-w-[960px]">
      <div className="mb-4">
        {post.files && (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-auto max-w-full mx-auto overflow-hidden"
          >
            {getImageUrls(post.files).map((url, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-[500px] sm:h-[250px]">
                  <Image
                    src={url}
                    alt={`게시물 이미지 ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="w-full h-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-3xl sm:text-xl font-bold sm:ml-4">{post.title}</h1>
        <div className="flex items-center sm:ml-4 sm:mr-4">
          <PostLike post_id={post.id} onLikesChange={() => {}} initialLikes={0} />
          <Image
            src="/assets/images/shareModal.svg"
            alt="공유하기"
            width={24}
            height={24}
            className="ml-4 sm:ml-2 cursor-pointer "
            onClick={handleShareClick}
          />
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-[30px] mb-[40px] sm:mt-[20px] sm:mb-[20px] sm:ml-4">
        작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}
      </div>
      <div className="flex items-center mb-[40px] sm:mb-[20px] sm:ml-4">
        <Image
          src={profile_url || "/path/to/default_profile_image.jpg"}
          alt="프로필 이미지"
          width={30}
          height={30}
          className="rounded-full"
        />
        <div className="ml-4 sm:ml-2">
          <p className="text-lg sm:text-base text-black">{user_nickname}</p>
        </div>
      </div>
      <div className="mb-10 sm:mb-5 sm:ml-4">
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon1.png" alt="여행 장소" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1">여행 장소 ㅣ null</p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon.png" alt="출발 장소" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1">출발 장소 ㅣ null</p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/icon2.png" alt="여행 비용" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1">여행 비용 ㅣ null</p>
        </div>
        <div className="flex items-center">
          <Image src="/assets/images/icon3.png" alt="여행 기간" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1">여행 기간 ㅣ null</p>
        </div>
      </div>
      {isEditing ? (
        <div className="sm:ml-4">
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
        <div className="sm:ml-4">
          <div className="prose max-w-none " style={{ minHeight: "100px" }}>
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
