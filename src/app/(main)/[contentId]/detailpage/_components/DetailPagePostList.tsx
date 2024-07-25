import { Comments } from "@/types/Comments.types";
import { fetchSessionData } from "@/utils/fetchSession";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DetailPagePostListProps {
  contentId: string;
}

const DetailPagePostList: React.FC<DetailPagePostListProps> = ({ contentId }) => {
  const supabase = createClient();

  const {
    data: sessionData,
    isPending: pendingSessionData,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const {
    data: commentData,
    isPending: pendingComments,
    error: CommentError,
  } = useQuery<Comments[], Error, Comments[]>({
    queryKey: ["comments", contentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("Comments").select("*").eq("content_id", contentId);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (pendingSessionData || pendingComments) {
    return <div>불러오는중...</div>;
  }

  if (sessionError) {
    return <h1>에러가 발생했습니다: {sessionError.message}</h1>;
  }

  if (CommentError) {
    return <h1>에러가 발생했습니다: {CommentError.message}</h1>;
  }

  return (
    <div>
      <h1>DetailPagePostList</h1>

      {commentData &&
        commentData.map((comment: Comments) => (
          <div key={comment.content_id}>
            <p>{comment.comment}</p>
          </div>
        ))}
    </div>
  );
};

export default DetailPagePostList;
