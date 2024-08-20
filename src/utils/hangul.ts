export const HANGUL = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"];
export const ranges = [
  45208, 45796, 46971, 47559, 48147, 49323, 50499, 51087, 52263, 52851, 53439, 54027, 54615, 55203,
];

export const getInitialConsonant = (str: string) => {
  const firstChar = str.charAt(0);
  const unicodeValue = firstChar.charCodeAt(0);

  if (unicodeValue >= 44032 && unicodeValue <= 55203) {
    for (let i = 0; i < ranges.length; i++) {
      if (unicodeValue < ranges[i]) {
        return HANGUL[i];
      }
    }
    return HANGUL[HANGUL.length - 1];
  }
  return firstChar.toUpperCase();
};
