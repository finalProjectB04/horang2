import { Likes } from "@/types/Likes.types";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

export const useLikes = (contentId: string | undefined | null, userId: string | undefined | null) => {
  return useQuery<Likes[]>({
    queryKey: ["likes", contentId],
    queryFn: async () => {
      if (!contentId) {
        return [];
      }

      const { data: likes, error } = await supabase.from("Likes").select("*").eq("content_id", contentId);

      if (error) {
        throw error;
      }
      return likes;
    },
    enabled: !!contentId,
  });
};
