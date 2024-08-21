import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { deletePost } from "@/components/posting/delete/route";
import { useModal } from "@/context/modal.context";
import useCustomConfirm from "@/hooks/useCustomConfirm";

interface Post {
  id: string;
  content: string | null;
  title: string | null;
  files: string | null;
  created_at: string | null;
  user_id: string;
  place: string | null;
  departure: string | null;
  cost: string | null;
  period: string | null;
}

interface PostContentProps {
  post: Post;
  sessionData: any;
}

const PostContent: React.FC<PostContentProps> = ({ post, sessionData }) => {
  const router = useRouter();
  const modal = useModal();
  const confirm = useCustomConfirm();

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await deletePost(postId);
    },
    onSuccess: () => {
      router.push("/community");
    },
    onError: (error: Error) => {
      modal.open({
        title: "삭제 실패",
        content: (
          <div className="text-center">
            <p>삭제에 실패했습니다. 다시 시도해주세요.</p>
          </div>
        ),
      });
    },
  });

  const handleEdit = () => {
    router.push(`/edit/${post.id}`);
  };

  const handleDelete = async () => {
    const confirmed = await confirm("정말로 이 게시물을 삭제하시겠습니까?");
    if (confirmed) {
      deleteMutation.mutate(post.id);
    } else {
      modal.open({
        title: "취소됨",
        content: (
          <div className="text-center">
            <p>삭제가 취소되었습니다.</p>
          </div>
        ),
      });
    }
  };

  return (
    <div className="sm:ml-4">
      <div className="mb-10 sm:mb-5">
        <div className="flex items-center mb-2">
          <Image src="/assets/images/community/travel_spot.svg" alt="여행 장소" width={24} height={24} />
          <p className="text-lg sm:text-base text-grey-900 ml-2 sm:ml-1 font-semibold">
            여행 장소 <span className="text-grey-200 font-normal mx-2">ㅣ</span> {post.place || "미정"}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/community/travel_start.svg" alt="출발 장소" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1 font-semibold">
            출발 장소 <span className="text-grey-200 font-normal mx-2">ㅣ</span> {post.departure || "미정"}
          </p>
        </div>
        <div className="flex items-center mb-2">
          <Image src="/assets/images/community/travel_budget.svg" alt="여행 비용" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1 font-semibold">
            여행 비용 <span className="text-grey-200 font-normal mx-2">ㅣ</span> {post.cost || "미정"}
          </p>
        </div>
        <div className="flex items-center">
          <Image src="/assets/images/community/travel_date.svg" alt="여행 기간" width={24} height={24} />
          <p className="text-lg sm:text-base text-black ml-2 sm:ml-1 font-semibold">
            여행 기간 <span className="text-grey-200 font-normal mx-2">ㅣ</span> {post.period || "미정"}
          </p>
        </div>
      </div>{" "}
      <div className="prose max-w-none" style={{ minHeight: "100px" }}>
        {post.content}
      </div>
      {sessionData && sessionData.user.id === post.user_id && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 justify-end">
            <button onClick={handleEdit} className="text-sm text-gray-700 hover:text-black">
              수정
            </button>
            <button onClick={handleDelete} className="text-sm text-gray-700 hover:text-black">
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;
