import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import PostLike from "@/components/posting/postcomponents/PostLike";

interface Post {
  id: string;
  content: string | null;
  title: string | null;
  files: string | null;
  created_at: string | null;
  user_id: string;
  place?: string | null;
  departure?: string | null;
  cost?: string | null;
  period?: string | null;
  user_nickname?: string | null;
}

interface PostHeaderProps {
  post: Post;
  sessionData: any;
  userNickname: string;
  profileUrl: string | null;
  onShareClick: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, sessionData, userNickname, profileUrl, onShareClick }) => {
  const getImageUrls = (files: string | null): string[] => {
    return files ? files.split(",").filter((url) => url.trim() !== "") : [];
  };

  return (
    <div>
      {post.files && (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          // navigation
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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl sm:text-xl font-bold sm:ml-4 mt-10">{post.title}</h1>
        <div className="flex items-center sm:ml-4 sm:mr-4">
          <PostLike post_id={post.id} onLikesChange={() => {}} initialLikes={0} />
          <Image
            src="/assets/images/shareModal.svg"
            alt="공유하기"
            width={24}
            height={24}
            className="ml-4 sm:ml-2 cursor-pointer"
            onClick={onShareClick}
          />
        </div>
      </div>
      <div className="text-sm text-grey-500 mt-[30px] mb-[40px] sm:mt-[20px] sm:mb-[20px] sm:ml-4">
        작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}
      </div>
      {sessionData && (
        <div className="flex items-center mb-[40px] sm:mb-[20px] sm:ml-4">
          <Image
            src={profileUrl || "/path/to/default_profile_image.jpg"}
            alt="프로필 이미지"
            width={30}
            height={30}
            className="rounded-full"
          />
          <div className="ml-4 sm:ml-2">
            <p className="text-lg sm:text-base text-black">{userNickname}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostHeader;
