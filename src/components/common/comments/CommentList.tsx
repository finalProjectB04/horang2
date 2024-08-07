import { useState, useEffect, useRef } from "react";
import CommentItem from "./CommentItem";

interface Comment {
  post_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  comments: string;
  user_nickname?: string;
}

const COMMENTS_PER_PAGE = 5;

const CommentList: React.FC<{
  comments: Comment[];
  userId: string | null;
  queryKey: string[];
}> = ({ comments, userId, queryKey }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true); // 페이지 최초 로드 여부를 추적하는 상태
  const hasScrolled = useRef(false); // 페이지가 스크롤된 여부를 추적하는 참조

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const currentComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // 페이지가 최초 로드될 때는 스크롤하지 않도록 설정
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    // 페이지가 변경된 경우 스크롤을 이동
    if (hasScrolled.current) {
      scrollToBottom();
    } else {
      hasScrolled.current = true;
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      handlePageChange(nextPage);
    }
  };

  const handlePreviousPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      handlePageChange(prevPage);
    }
  };

  return (
    <div>
      <div className="mb-4 mt-4 rounded-lg">
        {currentComments.length > 0 ? (
          <ul className="space-y-4">
            {currentComments.map((comment) => (
              <CommentItem key={comment.post_comment_id} comment={comment} userId={userId} queryKey={queryKey} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">댓글이 없습니다.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 bg-gray-200 rounded-lg"
            style={{ visibility: currentPage === 1 ? "hidden" : "visible" }}
          >
            이전
          </button>
          <span className="text-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-200 rounded-lg"
            style={{ visibility: currentPage === totalPages ? "hidden" : "visible" }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
