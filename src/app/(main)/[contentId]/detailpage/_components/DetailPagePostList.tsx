// "use client";

// import { fetchSessionData } from "@/utils/fetchSession";
// import { createClient } from "@/utils/supabase/client";
// import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";

// interface Comment {
//   id: string;
//   user_id: string;
//   content_id: string;
//   comment: string;
// }

// const fetchComments = async (contentId: string): Promise<Comment[]> => {
//   const { data, error } = await createClient().from("Comments").select("*").eq("content_id", contentId);
//   if (error) throw new Error(error.message);
//   return data;
// };

// const deleteComment = async (id: string) => {
//   const { error } = await createClient().from("Comments").delete().eq("id", id);
//   if (error) throw new Error(error.message);
// };

// interface DetailPagePostListProps {
//   userId: string | null;
//   contentId: string;
// }

// const DetailPagePostList: React.FC<DetailPagePostListProps> = ({ userId, contentId }) => {
//   const [visibleCount, setVisibleCount] = useState(2);
//   const queryClient = useQueryClient();

//   const queries = useQueries({
//     queries: [
//       { queryKey: ["session"], queryFn: fetchSessionData },
//       { queryKey: ["comments", contentId], queryFn: () => fetchComments(contentId) },
//     ],
//   });

//   const sessionResult = queries[0];
//   const commentsResult = queries[1];

//   const sessionData = sessionResult.data;
//   const isSessionLoading = sessionResult.isLoading;
//   const sessionError = sessionResult.error;

//   const comments = commentsResult.data || [];
//   const isCommentsLoading = commentsResult.isLoading;
//   const commentsError = commentsResult.error;

//   const sessionUserId = sessionData?.user?.id;

//   const deleteMutation = useMutation<void, Error, string>(deleteComment, {
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", contentId] }),
//   });

//   const handleDelete = (id: string) => {
//     deleteMutation.mutate(id);
//   };

//   const handleShowMore = () => {
//     setVisibleCount((prev) => prev + 10);
//   };

//   if (isSessionLoading || isCommentsLoading) return <div>불러오는 중...</div>;
//   if (sessionError) return <div>에러가 발생했습니다: {sessionError.message}</div>;
//   if (commentsError) return <div>에러가 발생했습니다: {commentsError.message}</div>;

//   return (
//     <div className="mt-4 max-w-4xl mx-auto">
//       {comments.slice(0, visibleCount).map((comment) => (
//         <div key={comment.id} className="p-4 border-b border-gray-300">
//           <div className="flex justify-between items-center">
//             <div>{comment.comment}</div>
//             {sessionUserId === comment.user_id && (
//               <div className="flex space-x-2">
//                 <button onClick={() => handleDelete(comment.id)} className="text-red-500">
//                   삭제
//                 </button>
//                 <button className="text-blue-500">수정</button>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//       {comments.length > visibleCount && (
//         <button onClick={handleShowMore} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//           더보기
//         </button>
//       )}
//     </div>
//   );
// };

// export default DetailPagePostList;                  아이디어가 없어서 gpt로 작업해봤는데 타입에러 나서 그냥 갈아 엎을듯
