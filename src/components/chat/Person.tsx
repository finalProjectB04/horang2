import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";
import { getRandomImage } from "@/utils/random";

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo("ko-KR");

interface PersonProps {
  index: number;
  name: string;
  userId: string;
  onlineAt?: string;
  isActive?: boolean;
  onChatScreen?: boolean;
  onClick?: () => void;
}

export default function Person({
  index,
  name,
  userId,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
}: PersonProps) {
  return (
    <div
      className={`w-full min-w-60 flex gap-4 items-center p-4 ${onClick && "cursor-pointer"} ${
        onChatScreen && "bg-gray-50"
      } ${!onChatScreen && isActive && "bg-light-blue-50"} ${!onChatScreen && !isActive && "bg-gray-50"}`}
      onClick={onClick}
    >
      <img src={getRandomImage(index)} alt={name} className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-black font-bold text-lg">{name}</p>
        <p className="text-gray-500 text-sm">{onlineAt && timeAgo.format(Date.parse(onlineAt))}</p>
      </div>
    </div>
  );
}
