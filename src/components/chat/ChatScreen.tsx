"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { presenceState, selectedUserIdState, selectedUserIndexState } from "@/atoms";
import Message from "./Message";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessage, getUserById, sendMessage } from "@/actions/chatActions";
import Person from "./Person";
import send from "../../../public/assets/images/send.png";
import Image from "next/image";

const ChatScreen = () => {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);
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
      return sendMessage({ message, chatUserId: selectedUserId });
    },
    onSuccess: () => {
      setMessage("");
      getAllMessageQuery.refetch();
    },
  });

  const getAllMessageQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessage({ chatUserId: selectedUserId }),
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
    <div className="h-screen flex-1 flex flex-col justify-center items-center bg-primary-50">
      <div className="h-3/4 w-3/4 min-w-[300px] overflow-y-auto bg-white rounded-2xl flex flex-col p-10 gap-3">
        <div className="h-full overflow-y-auto hidden-scroll">
          <div className="flex flex-col p-2 gap-5">
            {getAllMessageQuery.data?.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                isFromMe={message.receiver === selectedUserId}
                userImage={selectedUserQuery.data?.[0].profile_url || "/assets/images/profile_ex.png"}
              />
            ))}
          </div>
        </div>
        <div className="flex mt-4 border border-primary-100 rounded">
          <input
            className="p-4 w-full"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="min-w-20 p-3 bg-light-blue-600 text-black flex justify-center items-center"
            onClick={() => {
              if (message.trim()) {
                sendMessageMutation.mutate();
              }
            }}
          >
            {sendMessageMutation.isPending ? (
              <span>전송 중</span>
            ) : (
              <Image width={20} height={20} sizes="100%" src={send} alt="전송" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
