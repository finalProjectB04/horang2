"use client";

import Image from "next/image";

interface MessageProps {
  isFromMe: boolean;
  message: string;
  userImage?: string;
}

export default function Message({ isFromMe, message, userImage }: MessageProps) {
  return (
    <div className={`flex items-start ${isFromMe ? "ml-auto" : "mr-auto"}`}>
      {!isFromMe && userImage && (
        <Image width={64} height={64} src={userImage} alt="User" className="rounded-full mr-2" />
      )}
      <div
        className={`w-fit max-w-[360px] p-3 rounded-md ${
          isFromMe ? "bg-primary-400 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
