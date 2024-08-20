import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const deletePost = async (id: string) => {
  const { error: deleteRepliesError } = await supabase.from("Post_commentreplies").delete().eq("post_id", id);

  if (deleteRepliesError) throw new Error(deleteRepliesError.message);

  const { error: deleteCommentsError } = await supabase.from("Post_comments").delete().eq("post_id", id);

  if (deleteCommentsError) throw new Error(deleteCommentsError.message);

  const { data, error } = await supabase.from("Post").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return data;
};
