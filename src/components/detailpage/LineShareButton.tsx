import Image from "next/image";
import React from "react";

interface LineShareProps {
  id: string;
}

const LineShareButton: React.FC<LineShareProps> = ({ id }) => {
  const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${id}`,
  )}`;

  return (
    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
      <Image src="/assets/images/line-icon.svg" alt="Share on LINE" width={55} height={55} className="mt-2" />
    </a>
  );
};

export default LineShareButton;
