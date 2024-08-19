import Image from "next/image";
import React from "react";

interface WhatsAppShareButtonProps {
  text: string;
  url: string;
}

const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({ text, url }) => {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;

  const handleClick = () => {
    window.open(shareUrl, "_blank");
  };

  return (
    <button onClick={handleClick}>
      <Image src="/assets/images/whatsapp.svg" alt="WhatsApp 공유" width={55} height={55} />
    </button>
  );
};

export default WhatsAppShareButton;
