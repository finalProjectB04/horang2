export const formatDateToHours = (isoDate: string): string => {
  const localDate = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit" };
  return localDate.toLocaleTimeString("ko-KR", options);
};

export const formatDateToYears = (isoDate: string): string => {
  const localDate = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = localDate.toLocaleDateString("ko-KR", options);

  return formattedDate.replace(/\./g, ".");
};
