import { ApiInformation } from "@/types/Main";

export const GET = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/travelcourse");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
