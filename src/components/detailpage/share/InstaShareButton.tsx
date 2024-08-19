import Image from "next/image";

interface InstagramShareButtonProps {
  url: string;
  text: string;
}

const InstagramShareButton: React.FC<InstagramShareButtonProps> = ({ url, text }) => {
  const shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

  return (
    <button onClick={() => window.open(shareUrl, "_blank")}>
      <Image
        src="/assets/images/insta.svg"
        alt="Instagram Share"
        width={55}
        height={55}
        className="cursor-pointer rounded-xl"
      />
    </button>
  );
};

export default InstagramShareButton;
