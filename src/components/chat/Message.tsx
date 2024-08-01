"use client";

interface MessageProps {
  isFromMe: boolean;
  message: string;
}

export default function Message({ isFromMe, message }: MessageProps) {
  return (
    <div
      className={`w-fit p-3 rounded-md ${
        isFromMe ? "ml-auto bg-primary-400 text-white" : "mr-auto bg-gray-100 text-black"
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
