import { ApiInformation } from "@/types/Main";

export const FetchTravel = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/travel");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
