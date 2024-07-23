"use client";

import { fetchSessionData } from "@/utils/fetchSession";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const TestPage = () => {
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  useEffect(() => {
    if (sessionData) {
      console.log("🚀 ~ DetailPage ~ sessionData:", sessionData);
    }
  }, [sessionData]);

  if (isSessionLoading) {
    return <div>불러오는중...</div>;
  }

  if (sessionError) {
    return <h1>에러가 발생했습니다: {sessionError.message}</h1>;
  }

  return <div>TestPage</div>;
};

export default TestPage;
