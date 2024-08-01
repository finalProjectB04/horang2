interface Reply {
  parent_comment_id: string;
  created_at: string;
  user_id: string;
  content: string;
  user_nickname?: string;
}

interface ReplySectionProps {
  replies: Reply[];
  handleAddReply: (content: string) => void;
  newReply: string;
  setNewReply: (content: string) => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({ replies, handleAddReply, newReply, setNewReply }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">답글</h3>
      <div className="mb-2">
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="답글을 입력하세요..."
          className="w-full p-2 border rounded mb-2"
          rows={2}
        />
        <button onClick={() => handleAddReply(newReply)} className="bg-green-500 text-white px-4 py-2 rounded">
          답글 작성
        </button>
      </div>
      {replies.length > 0 ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.parent_comment_id} className="border-b py-2">
              <p>{reply.content}</p>
              <p className="text-sm text-gray-500">작성자: {reply.user_nickname}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>답글이 없습니다.</p>
      )}
    </div>
  );
};

export default ReplySection;
