"use client";

import TimeAgo from "javascript-time-ago";
import ko from "javascript-time-ago/locale/ko";
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
  myId: string;
  lastMessage: string;
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
  myId,
  lastMessage,
}: PersonProps) {
  return (
    <div
      className={`w-full flex border-b border-gray-200 items-center sm:p-4 md:p-0 lg:p-0 ${
        onClick && "cursor-pointer"
      } ${onChatScreen && "bg-orange-500"} ${!onChatScreen && isActive && "bg-orange-500"} ${
        !onChatScreen && !isActive && "bg-white"
      }`}
      onClick={onClick}
    >
      <Image
        width={64}
        height={64}
        src={url || "/assets/images/profile_ex.png"}
        alt={name}
        className="sm:hidden rounded-full mr-6 my-9"
      />
      <Image
        width={32}
        height={32}
        src={url || "/assets/images/profile_ex.png"}
        alt={name}
        className="sm:block md:hidden lg:hidden rounded-full mr-3 my-2"
      />
      <div className="flex flex-col">
        <div className="flex gap-4 items-center mb-1">
          <p className="text-secondary-800 sm:text-xs md:text-base lg:text-xl font-bold">{name}</p>
          <p className="text-gray-500 sm:text-[10px] md:text-sm lg:text-sm">
            {onlineAt && timeAgo.format(Date.parse(onlineAt))}
          </p>
        </div>
        <p
          className={`text-gray-500 ${!onChatScreen && isActive && "text-white"}  sm:text-[10px] md:text-sm lg:text-sm`}
        >
          {lastMessage}
        </p>
      </div>
    </div>
  );
}
