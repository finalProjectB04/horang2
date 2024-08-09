"use client";

import { formatDateToHours, formatDateToYears } from "@/utils/formatDate";
import Image from "next/image";
import { useEffect, useRef } from "react";
import DateSeperator from "./DateSeperator";

interface MessageProps {
  message: string;
  createdAt: string;
  previousCreatedAt?: number;
  isFromMe: boolean;
  id?: string;
  userImage?: string;
}

export default function Message({ message, createdAt, previousCreatedAt, isFromMe, id, userImage }: MessageProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef<boolean>(true);
  const today = new Date();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: isFirstRender ? "instant" : "smooth" });
      isFirstRender.current = false;
    }
  }, [message, isFirstRender]);

  return (
    <>
      {previousCreatedAt && new Date(previousCreatedAt).toDateString() !== new Date(createdAt).toDateString() && (
        <DateSeperator date={createdAt} />
      )}
      <div className={`sm:hidden md:flex lg:flex flex items-start ${isFromMe ? "ml-auto" : "mr-auto"}`}>
        {!isFromMe && userImage && (
          <Image width={64} height={64} src={userImage} alt="User" className="rounded-full mr-2" />
        )}
        <div className="flex flex-col">
          {!isFromMe && <p className="text-secondary-800">{id}</p>}
          <div className="flex">
            {isFromMe && <p className="flex items-end text-[10px] text-primary-600">{formatDateToHours(createdAt)}</p>}
            <div
              className={`w-fit max-w-[300px] mx-2 px-3 py-4 rounded-md ${
                isFromMe ? "bg-primary-400 text-white" : "bg-gray-100 text-secondary-800"
              }`}
            >
              <p>{message}</p>
            </div>
            {!isFromMe && <p className="flex items-end text-[10px] text-primary-600">{formatDateToHours(createdAt)}</p>}
          </div>
        </div>
      </div>
      <div className={`sm:flex md:hidden lg:hidden flex items-start ${isFromMe ? "ml-auto" : "mr-auto"}`}>
        {!isFromMe && userImage && (
          <Image width={32} height={32} src={userImage} alt="User" className="rounded-full mr-2" />
        )}
        <div className="flex flex-col">
          {!isFromMe && <p className="text-secondary-800 mb-2">{id}</p>}
          <div className="flex">
            {isFromMe && <p className="flex items-end text-[10px] text-primary-600">{formatDateToHours(createdAt)}</p>}
            <div
              className={`w-fit max-w-[250px] mx-2 px-3 py-4 rounded-md ${
                isFromMe ? "bg-primary-200 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <p className="text-xs">{message}</p>
            </div>
            {!isFromMe && <p className="flex items-end text-[10px] text-primary-600">{formatDateToHours(createdAt)}</p>}
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </>
  );
}
