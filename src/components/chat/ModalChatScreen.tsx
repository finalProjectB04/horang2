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
import useModalStore from "@/zustand/modalStore";

interface ModalChatScreenProps {
  id: string;
  nickName: string;
}

const ModalChatScreen = ({ id, nickName }: ModalChatScreenProps) => {
  const { selectedUserId } = useChatStore();
  const { modals, toggleModal } = useModalStore();
  const isOpen = modals[id];

  const [message, setMessage] = useState("");
  const supabase = createClient();

  const stopBubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

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

  if (!isOpen) return null;

  return (
    <div className="sm:flex md:hidden lg:hidden fixed top-0 left-0 w-full h-screen flex flex-col bg-primary-100 z-50">
      <div className="flex items-center justify-between">
        <button className="flex items-center justify-start mx-6 my-8" onClick={() => toggleModal(id)}>
          <Image src="/assets/images/back.png" width={10} height={17} alt="뒤로가기" />
        </button>
        <p className="flex-grow text-center text-lg font-bold text-secondary-800 p-2">{nickName}</p>
        <span className="mx-6 my-8"></span>
      </div>
      <div className="h-screen flex items-center overflow-y-auto flex-col p-4 gap-3" onClick={stopBubble}>
        <div className="h-full max-h-[70%] overflow-y-auto hidden-scroll">
          <div className="flex justify-start">
            <div className="w-[360px] flex flex-col p-2 gap-2">
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
        </div>
        <form
          className="fixed bottom-10 w-[300px] flex mt-4 rounded-[20px] bg-white mx-auto"
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
            className="mr-4 bg-light-blue-600 text-black flex justify-center items-center"
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
              <Image width={20} height={20} sizes="100%" src={send} alt="전송" className="ml-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalChatScreen;
