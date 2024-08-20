const CurrentKoreanTime = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const koreaTimeOffset = 9 * 60 * 60000;
  return now.getTime() + utcOffset + koreaTimeOffset;
};
