"use client";

import React, { useEffect } from "react";
import Person from "./Person";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/actions/chatActions";
import { User } from "@/types/User.types";
import useChatStore from "@/zustand/chatStore";

interface loggedInUserProps {
  loggedInUser: User;
}

const ChatList = ({ loggedInUser }: loggedInUserProps) => {
  const { selectedUserId, setSelectedUserId, selectedUserIndex, setSelectedUserIndex, presence, setPresence } =
    useChatStore();

  const supabase = createClient();

  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      return allUsers.filter((user) => user.id !== loggedInUser?.id);
    },
  });

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
        console.log(newState);
        console.log(newStateObj?.[loggedInUser.id]);
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

  return (
    <div className="h-screen flex-1 flex flex-col justify-center items-center pl-[240px] pr-[40px]">
      <div className="w-full min-w-[300px] mt-[200px] flex flex-col overflow-y-auto">
        <div className="flex">
          <div className="text-black font-extrabold text-4xl">호랑이 목록</div>
        </div>
        <div className="w-full flex flex-col overflow-y-auto hidden-scroll">
          {getAllUsersQuery.isPending ? (
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center space-x-4 p-4 border-b border-gray-200  h-[170px]"
                >
                  <div className="h-20 w-20 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            getAllUsersQuery.data?.map((user, index) => (
              <Person
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id);
                  setSelectedUserIndex(index);
                }}
                index={index}
                isActive={selectedUserId === user.id}
                name={user.user_nickname!}
                url={user.profile_url!}
                onChatScreen={false}
                onlineAt={presence?.[user.id]?.[0]?.onlineAt}
                userId={user.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
