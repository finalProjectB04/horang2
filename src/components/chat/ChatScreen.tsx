"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { presenceState, selectedUserIdState, selectedUserIndexState } from "@/atoms";
import Message from "./Message";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessage, getUserById, sendMessage } from "@/actions/chatActions";
import Person from "./Person";

const ChatScreen = () => {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => getUserById(selectedUserId),
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
      <div className="h-3/4 w-2/3 overflow-y-scroll bg-white rounded-2xl flex flex-col p-10 gap-3 justify-between">
        <Person
          index={selectedUserIndex}
          isActive={false}
          name={selectedUserQuery.data?.email?.split("@")[0]}
          onChatScreen={true}
          onlineAt={presence?.[selectedUserId]?.[0].onlineAt}
          userId={selectedUserQuery.data?.id}
        />
        <div className="h-5/6 flex flex-col p-4 gap-3">
          {getAllMessageQuery.data?.map((message) => (
            <Message key={message.id} message={message.message} isFromMe={message.receiver === selectedUserId} />
          ))}
        </div>
        <div className="flex mt-4 border border-primary-100 rounded">
          <input
            className="p-4 w-full border-2 border-light-blue-900"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="min-w-20 p-3 bg-light-blue-600 text-black" onClick={() => sendMessageMutation.mutate()}>
            {sendMessageMutation.isPending ? <span>전송 중</span> : <span>전송</span>}
            {/* <span>전송</span> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
