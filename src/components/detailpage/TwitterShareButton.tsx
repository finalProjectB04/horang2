import Image from "next/image";
import React from "react";

interface TwitterShareButtonProps {
  url: string;
  text: string;
}

const TwitterShareButton: React.FC<TwitterShareButtonProps> = ({ url, text }) => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  return (
    <button onClick={() => window.open(shareUrl, "_blank")}>
      <Image src="/assets/images/X_icon.svg" alt="Twitter Share" width={55} height={55} className="cursor-pointer" />
    </button>
  );
};

export default TwitterShareButton;
