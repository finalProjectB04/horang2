import ChatList from "@/components/chat/ChatList";
import ChatScreen from "@/components/chat/ChatScreen";
import { createServerSupabaseClient } from "@/utils/supabase/serverAdmin";
import React from "react";

const ChatPage = async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <ChatList loggedInUser={session?.user} />
      <ChatScreen />
    </div>
  );
};

export default ChatPage;
