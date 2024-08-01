"use client";

import React, { useEffect, useState } from "react";
import Person from "./Person";
import { useRecoilState } from "recoil";
import { presenceState, selectedUserIdState, selectedUserIndexState } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/actions/chatActions";
import Tab from "../common/Tab";

const ChatList = ({ loggedInUser }) => {
  const [selectedUserId, setSeletedUserId] = useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSeletedUserIndex] = useRecoilState(selectedUserIndexState);
  const [presensce, setPresence] = useRecoilState(presenceState);
  const [activeTab, setActiveTab] = useState<string>("전체");
  const tabs = ["전체", "숙소", "놀거리", "음식점"];

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
          {tabs.map((tab) => (
            <Tab key={tab} TapName={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
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
                  setSeletedUserId(user.id);
                  setSeletedUserIndex(index);
                }}
                index={index}
                isActive={selectedUserId === user.id}
                name={user.user_nickname}
                url={user.profile_url}
                onChatScreen={false}
                onlineAt={presensce?.[user.id]?.[0]?.onlineAt}
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
