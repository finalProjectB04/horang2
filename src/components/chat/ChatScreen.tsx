"use client";

import { useEffect, useState } from "react";
import Message from "./Message";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessageWithUser, getUserById, sendMessage } from "@/actions/chatActions";
import send from "../../../public/assets/images/send.png";
import sending from "../../../public/assets/images/loading_icon.png";
import Image from "next/image";
import useChatStore from "@/zustand/chatStore";

const ChatScreen = () => {
  const { selectedUserId } = useChatStore();

  const [message, setMessage] = useState("");

  const supabase = createClient();

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: async () => {
      const selectedUser = await getUserById(selectedUserId);
      return selectedUser;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({ message, chatUserId: selectedUserId, created_at: new Date().toISOString() });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessageQuery.refetch();
    },
  });

  const getAllMessageQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessageWithUser({ chatUserId: selectedUserId }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && !payload.errors) {
            getAllMessageQuery.refetch();
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="sm:hidden h-screen flex-1 flex flex-col justify-center items-center bg-primary-50">
      <div className="w-3/4 h-2/3 min-w-[300px] overflow-y-auto hidden-scroll bg-white rounded-2xl flex flex-col py-8 px-10 gap-3">
        <p className="flex-grow text-center text-lg font-bold text-secondary-800 p-2">
          {selectedUserQuery.data && Array.isArray(selectedUserQuery.data) && selectedUserQuery.data.length > 0
            ? selectedUserQuery.data[0].user_nickname
            : ""}
        </p>
        <div className="h-full overflow-y-auto hidden-scroll">
          <div className="flex flex-col p-2 gap-5">
            {getAllMessageQuery.data?.map((message, index) => {
              const previousMessage = getAllMessageQuery.data?.[index - 1];
              return (
                <Message
                  key={message.id}
                  message={message.message}
                  createdAt={message.created_at}
                  id={selectedUserQuery.data?.[0].user_nickname!}
                  isFromMe={message.receiver === selectedUserId}
                  userImage={selectedUserQuery.data?.[0].profile_url || "/assets/images/profile_ex.png"}
                  previousCreatedAt={previousMessage?.created_at}
                />
              );
            })}
          </div>
        </div>
        <form
          className="flex mt-4 border border-primary-100 rounded-[20px] justify-between"
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim() && !sendMessageMutation.isPending) {
              sendMessageMutation.mutate();
            }
          }}
        >
          <input
            className="p-4 w-full rounded-[20px]"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(event) => {
              const inputValue = event.target.value;
              if (inputValue.length <= 1000) {
                setMessage(inputValue);
              }
            }}
          />
          <button
            type="submit"
            className="mr-4 bg-light-blue-600 text-black flex justify-center items-center ml-5"
            disabled={message.length > 1000 || message.trim() === ""}
          >
            {sendMessageMutation.isPending ? (
              <Image
                width={20}
                height={20}
                sizes="100%"
                src={sending}
                alt="전송중"
                className="ml-5 animate-spin-veryslow"
              />
            ) : (
              <Image width={20} height={20} sizes="100%" src={send} alt="전송" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
