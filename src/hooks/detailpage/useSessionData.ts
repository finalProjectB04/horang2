import { useQuery } from "@tanstack/react-query";
import { fetchSessionData } from "./../../utils/auth";

export const useSessionData = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });
};
