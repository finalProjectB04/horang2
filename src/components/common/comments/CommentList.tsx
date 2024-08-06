import CommentItem from "./CommentItem";

interface Comment {
  post_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  comments: string;
  user_nickname?: string;
}

const CommentList: React.FC<{
  comments: Comment[];
  userId: string | null;
  queryKey: string[];
}> = ({ comments, userId, queryKey }) => {
  return (
    <div className="mb-4 bg-gray-50 mt-4 rounded-lg shadow">
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.post_comment_id} comment={comment} userId={userId} queryKey={queryKey} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default CommentList;
