"use client";

import React, { useEffect } from "react";
import Person from "./Person";
import { useRecoilState } from "recoil";
import { presenceState, selectedUserIdState, selectedUserIndexState } from "@/atoms";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/actions/chatActions";
import { User } from "@/types/User.types";

const ChatList = ({ loggedInUser }) => {
  const [selectedUserId, setSeletedUserId] = useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSeletedUserIndex] = useRecoilState(selectedUserIndexState);
  const [presensce, setPresence] = useRecoilState(presenceState);

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
    <div className="h-screen flex-1 flex flex-col justify-start items-start">
      <div className="w-full overflow-y-scroll">
        {getAllUsersQuery.data?.map((user, index) => (
          <Person
            key={user.id}
            onClick={() => {
              setSeletedUserId(user.id);
              setSeletedUserIndex(index);
            }}
            index={index}
            isActive={selectedUserId === user.id}
            name={user.email.split("@")[0]}
            onChatScreen={false}
            onlineAt={presensce?.[user.id]?.[0].onlineAt}
            userId={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
