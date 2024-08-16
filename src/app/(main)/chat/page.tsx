import ChatList from "@/components/chat/ChatList";
import ChatScreen from "@/components/chat/ChatScreen";
import { createServerSupabaseClient } from "@/utils/supabase/serverAdmin";
import React from "react";

const ChatPage = async () => {
  const supabase = await createServerSupabaseClient();

  const { data: User, error } = await supabase.auth.getUser();

  if (!User) return;
  const { data } = await supabase.from("Users").select("*").eq("id", User?.user!.id);

  if (!data) return;

  return (
    <div className="w-full h-[screen-84px] flex justify-center items-center">
      <ChatList loggedInUser={data[0]} />
      <ChatScreen />
    </div>
  );
};

export default ChatPage;
