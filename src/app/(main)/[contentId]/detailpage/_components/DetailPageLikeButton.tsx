"use client";

import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { supabase } from "./../../../../../components/common/contexts/supabase.context";

interface LikeBtnProps {
  contentId: string;
}

const LikeBtn: React.FC<LikeBtnProps> = ({ contentId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        setUserId(session.user.id);
        await ensureUserExists(session.user.id);
      }
    };
    fetchSession();
  }, []);

  const ensureUserExists = async (userId: string) => {
    const { data: user, error } = await supabase.from("Users").select("id").eq("id", userId).single();

    if (error && error.code === "PGRST116") {
      // 사용자 추가
      const { error: insertError } = await supabase.from("Users").insert([{ id: userId }]);

      if (insertError) {
        console.error("Error inserting user:", insertError);
      }
    } else if (error) {
      console.error("Error fetching user:", error);
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["likes", contentId],
    queryFn: async () => {
      const { data: likes, error } = await supabase.from("Likes").select("user_id").eq("content_id", contentId);

      if (error) {
        throw error;
      }
      return likes;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("Likes").delete().match({ user_id: userId, content_id: contentId });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setLikeCount((prev) => prev - 1);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("Likes").insert([
        {
          user_id: userId,
          content_id: contentId,
        },
      ]);

      if (error) {
        console.error("Error adding like:", error);
        throw error;
      } else {
        console.log("Like successfully added.");
      }
    },
    onSuccess: () => {
      setLikeCount((prev) => prev + 1);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  useEffect(() => {
    if (data) {
      const result = data.find((item: any) => item.user_id === userId);
      setLiked(!!result);
      setLikeCount(data.length);
    }
  }, [data, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred...</div>;
  }

  const handleLikeBtn = async () => {
    try {
      if (liked) {
        deleteMutation.mutate(userId!);
      } else {
        addMutation.mutate();
      }
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("Error updating like status", error);
    }
  };

  const likeImage = liked ? "/assets/images/Property 1=Default.png" : "/assets/images/Property 1=fail.png";

  return (
    <button onClick={handleLikeBtn} disabled={!userId}>
      <Image src={likeImage} alt={liked ? "Unlike" : "Like"} width={50} height={50} />
    </button>
  );
};
export default LikeBtn;
