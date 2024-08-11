"use server";

import { Post } from "@/types/Post.types";
import { createServerSupabaseClient } from "@/utils/supabase/serverAdmin";

export async function getPosts({ myId }: { myId: string }): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session?.user) {
    return [];
  }

  const { data: posts, error: getPosts } = await supabase.from("Post").select("*").eq("user_id", myId);

  if (error) {
    return [];
  }

  return posts!;
}
