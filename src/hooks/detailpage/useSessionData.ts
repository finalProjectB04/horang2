import { fetchSessionData } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";

export const useSessionData = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });
};
