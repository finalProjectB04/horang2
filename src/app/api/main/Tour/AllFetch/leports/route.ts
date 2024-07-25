import { ApiInformation } from "@/types/Main";

export const FetchLeports = async (): Promise<ApiInformation[]> => {
  const res = await fetch("/api/main/Tour/leports");
  if (!res.ok) {
    throw new Error("error");
  }
  return res.json();
};
