import { fetchSessionData } from "@/utils/fetchSession";
import { useQuery } from "@tanstack/react-query";

export const useSessionData = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });
};
