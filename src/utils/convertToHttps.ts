export const convertToHttps = (url: string | null): string => {
  if (!url) return "";
  return url.startsWith("http:") ? url.replace(/^http:/, "https:") : url;
};
