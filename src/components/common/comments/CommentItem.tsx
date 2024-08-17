import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import AddReply from "./AddReply";
import ReplyItem from "./ReplyItem";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko.json";
import { useModal } from "@/context/modal.context";

TimeAgo.addDefaultLocale(ko);
const timeAgo = new TimeAgo("ko-KR");

const supabase = createClient();

interface Comment {
  post_comment_id: string;
  created_at: string | null;
  post_id: string;
  user_id: string;
  comments: string;
  user_nickname?: string;
}

interface Reply {
  id: string;
  parent_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  user_nickname?: string;
}

const REPLIES_PER_PAGE = 5;

const CommentItem: React.FC<{
  comment: Comment;
  userId: string | null;
  queryKey: string[];
}> = ({ comment, userId, queryKey }) => {
  const queryClient = useQueryClient();
  const modal = useModal();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyPage, setReplyPage] = useState<number>(1);
  const replyFormRef = useRef<HTMLDivElement>(null);
  const [scrollToReplyForm, setScrollToReplyForm] = useState<boolean>(false);

  const scrollToReplyFormHandler = () => {
    if (replyFormRef.current) {
      replyFormRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const deleteReplies = async (commentId: string) => {
    const { error: deleteRepliesError } = await supabase
      .from("Post_commentreplies")
      .delete()
      .eq("parent_comment_id", commentId);

    if (deleteRepliesError) {
      modal.open({
        title: "에러",
        content: <div className="text-center">대댓글 삭제 중 오류가 발생했습니다.</div>,
      });
      throw new Error(deleteRepliesError.message);
    }
  };

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteReplies(commentId);

      const { error } = await supabase.from("Post_comments").delete().eq("post_comment_id", commentId);

      if (error) {
        modal.open({
          title: "에러",
          content: <div className="text-center">댓글 삭제 중 오류가 발생했습니다.</div>,
        });
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      modal.open({
        title: "실패",
        content: <div className="text-center">댓글 삭제에 실패했습니다. 다시 시도해주세요.</div>,
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, newContent }: { commentId: string; newContent: string }) => {
      const { data, error } = await supabase
        .from("Post_comments")
        .update({ comments: newContent })
        .eq("post_comment_id", commentId)
        .select("*");

      if (error) {
        modal.open({
          title: "에러",
          content: <div className="text-center">댓글 수정 중 오류가 발생했습니다.</div>,
        });
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingCommentId(null);
      setEditingContent("");
    },
    onError: (error) => {
      modal.open({
        title: "실패",
        content: <div className="text-center">댓글 수정에 실패했습니다. 다시 시도해주세요.</div>,
      });
    },
  });

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editingContent.trim() === "") {
      modal.open({
        title: "경고",
        content: <div className="text-center">댓글 내용을 입력하세요.</div>,
      });
      return;
    }
    updateCommentMutation.mutate({ commentId, newContent: editingContent });
  };

  const handleDeleteComment = (commentId: string) => {
    modal.open({
      title: "삭제 확인",
      content: (
        <div className="text-center">
          <p>정말로 이 댓글을 삭제하시겠습니까?</p>
          <button
            onClick={() => {
              deleteCommentMutation.mutate(commentId);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit(comment.post_comment_id);
    }
  };

  const { data: replies = [], isError: isRepliesError } = useQuery({
    queryKey: ["replies", comment.post_comment_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post_commentreplies")
        .select(
          `
          id,
          parent_comment_id,
          created_at,
          post_id,
          user_id,
          content,
          Users:user_id (user_nickname) 
        `,
        )
        .eq("parent_comment_id", comment.post_comment_id)
        .order("created_at", { ascending: true });

      if (error) {
        modal.open({
          title: "에러",
          content: <div className="text-center">대댓글 불러오기 중 오류가 발생했습니다.</div>,
        });
        throw new Error(error.message);
      }

      return data.map((item: any) => ({
        id: item.id,
        parent_comment_id: item.parent_comment_id,
        created_at: item.created_at,
        post_id: item.post_id,
        user_id: item.user_id,
        content: item.content,
        user_nickname: item.Users?.user_nickname || "",
      })) as Reply[];
    },
  });

  const totalReplyPages = Math.ceil(replies.length / REPLIES_PER_PAGE);
  const startIndex = (replyPage - 1) * REPLIES_PER_PAGE;
  const currentReplies = replies.slice(startIndex, startIndex + REPLIES_PER_PAGE);

  const handleNextReplyPage = () => {
    if (replyPage < totalReplyPages) {
      setReplyPage((prevPage) => prevPage + 1);
      setScrollToReplyForm(true);
    }
  };

  const handlePreviousReplyPage = () => {
    if (replyPage > 1) {
      setReplyPage((prevPage) => prevPage - 1);
      setScrollToReplyForm(true);
    }
  };

  useEffect(() => {
    if (scrollToReplyForm) {
      scrollToReplyFormHandler();
      setScrollToReplyForm(false);
    }
  }, [replyPage, scrollToReplyForm]);

  return (
    <li className="border border-primary-100 sm:border-none bg-white  rounded-lg w-full max-w-full lg:max-w-[1440px] mx-auto h-auto ">
      {editingCommentId === comment.post_comment_id ? (
        <div className="bg-white rounded-lg shadow ">
          <textarea
            value={editingContent}
            onChange={(event) => setEditingContent(event.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-2 px-3 border border-primary-100 rounded-lg mb-2 sm:py-1 sm:px-2 sm:text-[14px]"
            rows={4}
          />
          <div className="flex space-x-2 mb-2 ">
            <button
              onClick={() => handleSaveEdit(comment.post_comment_id)}
              className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded sm:px-2 sm:py-1"
            >
              저장
            </button>
            <button
              onClick={() => setEditingCommentId(null)}
              className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black sm:px-2 sm:py-1"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="relative sm:p-2 ">
          <div className="absolute top-[5px] left-[5px] sm:top-[2px] sm:left-[2px]">
            <Image
              src="/assets/images/profile_ex.png"
              alt="유저 프로필 사진"
              width={40}
              height={40}
              className="rounded-full sm:w-[30px] sm:h-[30px]"
            />
          </div>
          <div className="ml-16 flex items-center sm:ml-12">
            <span className="font-semibold mt-[15px] inline-block sm:mt-[10px] sm:text-[14px]">
              {comment.user_nickname}
            </span>
            {comment.user_id === userId && (
              <div className="absolute top-[15px] right-2 flex space-x-3 sm:top-[10px] sm:right-1">
                <button
                  onClick={() => {
                    setShowReplies((prev) => !prev);
                    setScrollToReplyForm(true);
                  }}
                  className="hidden sm:inline-block sm:mr-1"
                >
                  <Image
                    src={`/assets/images/${showReplies ? "icon5.png" : "icon4.png"}`}
                    alt={showReplies ? "대댓글 숨기기" : "대댓글 보기"}
                    width={20}
                    height={20}
                  />
                </button>
                <span
                  onClick={() => handleEditComment(comment.post_comment_id, comment.comments)}
                  className="cursor-pointer hidden sm:inline-block"
                >
                  <Image src="/assets/images/detailpage/Mode_edit.svg" alt="수정" width={20} height={20} />
                </span>
                <span
                  onClick={() => handleDeleteComment(comment.post_comment_id)}
                  className="cursor-pointer hidden sm:inline-block"
                >
                  <Image src="/assets/images/detailpage/Delete.svg" alt="삭제" width={20} height={20} />
                </span>
                <span
                  onClick={() => handleEditComment(comment.post_comment_id, comment.comments)}
                  className="cursor-pointer sm:hidden text-black"
                >
                  수정
                </span>
                <span
                  onClick={() => handleDeleteComment(comment.post_comment_id)}
                  className="cursor-pointer sm:hidden text-black"
                >
                  삭제
                </span>
              </div>
            )}
          </div>
          <div className="ml-16 mt-[6px] text-sm sm:ml-12 sm:mt-[4px] text-gray-500 sm:text-[12px]">
            {comment.created_at ? timeAgo.format(new Date(comment.created_at)) : "방금 전"}
          </div>
          <p className="ml-16 mt-[20px] sm:ml-12 sm:mt-[10px] text-gray-800 text-base sm:text-[14px]">
            {comment.comments}
          </p>
          <button
            onClick={() => {
              setShowReplies((prev) => !prev);
              setScrollToReplyForm(true);
            }}
            className="hover:text-blue-700 ml-16 mb-4 mt-10 text-[12px] sm:hidden"
          >
            {showReplies ? "대댓글 숨기기" : "대댓글 보기"}
          </button>

          {showReplies && (
            <div>
              {isRepliesError ? (
                <p className="text-red-500 sm:text-[12px]">대댓글을 불러오는 중 오류가 발생했습니다.</p>
              ) : (
                <>
                  <ul className="space-y-2 mt-4">
                    {currentReplies.map((reply) => (
                      <ReplyItem
                        key={reply.id}
                        reply={reply}
                        userId={userId}
                        queryKey={["replies", comment.post_comment_id]}
                      />
                    ))}
                  </ul>
                  {totalReplyPages > 1 && (
                    <div ref={replyFormRef} className="flex justify-center items-center mt-4 space-x-4">
                      <div className="w-[100px] flex justify-center">
                        <button
                          onClick={handlePreviousReplyPage}
                          style={{ visibility: replyPage === 1 ? "hidden" : "visible" }}
                          className="px-4 py-2 bg-gray-200 rounded-lg sm:px-2 sm:py-1"
                        >
                          이전
                        </button>
                      </div>
                      <span className="text-lg sm:text-[14px]">
                        {replyPage} / {totalReplyPages}
                      </span>
                      <div className="w-[100px] flex justify-center">
                        <button
                          onClick={handleNextReplyPage}
                          style={{ visibility: replyPage === totalReplyPages ? "hidden" : "visible" }}
                          className="px-4 py-2 bg-gray-200 rounded-lg sm:px-2 sm:py-1"
                        >
                          다음
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {userId && (
                <div ref={replyFormRef}>
                  <AddReply
                    parentCommentId={comment.post_comment_id}
                    postId={comment.post_id}
                    queryKey={["replies", comment.post_comment_id]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default CommentItem;
