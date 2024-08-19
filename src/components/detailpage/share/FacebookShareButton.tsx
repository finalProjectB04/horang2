import Image from "next/image";

interface FacebookShareButtonProps {
  url: string;
  text: string;
}

const FacebookShareButton: React.FC<FacebookShareButtonProps> = ({ url, text }) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(
    text,
  )}`;

  return (
    <button onClick={() => window.open(shareUrl, "_blank")}>
      <Image
        src="/assets/images/meta-icon.svg"
        alt="Facebook Share"
        width={55}
        height={55}
        className="cursor-pointer rounded-xl"
      />
    </button>
  );
};

export default FacebookShareButton;
