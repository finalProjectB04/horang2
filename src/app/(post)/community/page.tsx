"use client";

import { selectCommunityData } from "@/components/posting/select/SelectCommunityData";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Community = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["community"],
    queryFn: selectCommunityData,
  });
  if (isPending) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>에러</div>;
  } else {
    console.log("supabase데이터=>", data);
  }
  return <div>page</div>;
};

export default Community;
