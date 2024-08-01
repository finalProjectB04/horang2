import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";
import { getRandomImage } from "@/utils/random";
import Image from "next/image";

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo("ko-KR");

interface PersonProps {
  index: number;
  name: string;
  userId: string;
  url: string;
  onlineAt?: string;
  isActive?: boolean;
  onChatScreen?: boolean;
  onClick?: () => void;
}

export default function Person({
  index,
  name,
  userId,
  url,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick,
}: PersonProps) {
  return (
    <div
      className={`w-full flex border-b border-gray-200 items-center p-4 ${onClick && "cursor-pointer"} ${
        onChatScreen && "bg-orange-500"
      } ${!onChatScreen && isActive && "bg-orange-500"} ${!onChatScreen && !isActive && "bg-white"}`}
      onClick={onClick}
    >
      <Image
        width={64}
        height={64}
        src={url || "/assets/images/profile_ex.png"}
        alt={name}
        className="rounded-full mr-6 my-9"
      />
      <div>
        <p className="text-secondary-800 text-xl font-bold">{name}</p>
        <p className="text-gray-500 text-sm">{onlineAt && timeAgo.format(Date.parse(onlineAt))}</p>
      </div>
    </div>
  );
}
