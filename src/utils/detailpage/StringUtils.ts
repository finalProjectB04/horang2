export const parseHTMLString = (htmlString: string): string | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const anchor = doc.querySelector("a");
  return anchor ? anchor.href : null;
};

export const splitText = (text: string, chunkSize: number) => {
  const regex = new RegExp(`(.{1,${chunkSize}})`, "g");
  const matched = text.match(regex);
  return matched ? matched.join("\n") : "";
};
