"use client";

import React, { useEffect, useState } from "react";
import Person from "./Person";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getAllMessage, getAllUsers } from "@/actions/chatActions";
import { User } from "@/types/User.types";
import useChatStore from "@/zustand/chatStore";
import { useRouter } from "next/navigation";
import ModalChatScreen from "./ModalChatScreen";
import useModalStore from "@/zustand/modalStore";
import Image from "next/image";

interface loggedInUserProps {
  loggedInUser: User;
}

const ChatList = ({ loggedInUser }: loggedInUserProps) => {
  const { selectedUserId, setSelectedUserId, selectedUserIndex, setSelectedUserIndex, presence, setPresence } =
    useChatStore();
  const { toggleModal, resetModals } = useModalStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createClient();

  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      return allUsers.filter((user) => user.id !== loggedInUser?.id);
    },
  });

  const { data: allMessages, isPending } = useQuery({
    queryKey: ["lastMessage", loggedInUser?.id],
    queryFn: () => {
      if (loggedInUser?.id) {
        return getAllMessage({ myId: loggedInUser.id });
      }
      return Promise.resolve([]);
    },
    enabled: !!loggedInUser?.id,
  });

  function getLastMessage(userId: string) {
    const lastMessageData = allMessages?.filter((message) => message.sender === userId).pop();
    return lastMessageData?.message || null;
  }

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          key: loggedInUser?.id,
        },
      },
    });

    channel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const newState = channel.presenceState();
        const newStateObj = JSON.parse(JSON.stringify(newState));
        setPresence(newStateObj);
      },
    );

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      await channel.track({
        onlineAt: new Date().toISOString(),
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredUsers = getAllUsersQuery.data?.filter((user) =>
    user.user_nickname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        resetModals();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-full flex-1 flex flex-col sm:px-6 justify-center items-center">
      <div className="w-3/4 sm:h-5/6 md:h-5/6 lg:h-5/6 flex flex-col ">
        <button
          className="sm:block md:hidden lg:hidden w-fit flex items-center justify-start"
          onClick={() => router.back()}
        >
          <Image src="/assets/images/back.png" width={10} height={17} alt="뒤로가기" />
        </button>
        <div className="w-full min-w-[300px] flex flex-col overflow-y-auto">
          <div className="flex flex-col">
            <div className="text-secondary-800 sm:font-bold md:font-extrabold lg:font-extrabold sm:py-3 sm:text-2xl md:text-4xl lg:text-4xl sm:my-2 md:my-3 lg:my-4 ">
              호랑이 목록
            </div>
            <input
              type="text"
              placeholder="호랑이 이름을 입력하세요"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="border p-2 mb-4 border-primary-100 rounded-[20px]"
            />
          </div>
          <div className="w-full flex flex-col overflow-y-auto hidden-scroll">
            {getAllUsersQuery.isPending ? (
              <div className="flex flex-col space-y-4">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center space-x-4 p-4 border-b border-grey-200 lg:h-[170px]"
                  >
                    <div className="sm:h-10 lg:h-20 w-20 bg-grey-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="sm:h-5 lg:h-10 bg-grey-200 rounded" />
                      <div className="sm:h-5 lg:h-10 bg-grey-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers?.length! > 0 ? (
              filteredUsers?.map((user, index) =>
                user.user_nickname ? (
                  <Person
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setSelectedUserIndex(index);
                      toggleModal(user.id);
                    }}
                    index={index}
                    isActive={selectedUserId === user.id}
                    name={user.user_nickname}
                    url={user.profile_url!}
                    onChatScreen={false}
                    onlineAt={presence?.[user.id]?.[0]?.onlineAt}
                    userId={user.id}
                    myId={loggedInUser.id}
                    lastMessage={getLastMessage(user.id) || "서로 대화를 해보세요!"}
                  />
                ) : (
                  <div key={user.id} className="p-4 text-grey-500 text-center">
                    사용자 별명이 없습니다
                  </div>
                ),
              )
            ) : (
              <div className="p-4 text-grey-500 text-center">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
        {filteredUsers?.map((user) => (
          <ModalChatScreen key={user.id} id={user.id} nickName={user.user_nickname!} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
