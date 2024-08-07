"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    Kakao: any;
  }
}
interface KakaoShareButtonProps {
  id: string;
  className?: string;
}
const KakaoShareButton = ({ id }: KakaoShareButtonProps) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${id}`;
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  useEffect(() => {
    const initializeKakao = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
        setIsKakaoLoaded(true);
      }
    };
    if (typeof window !== "undefined") {
      if (window.Kakao) {
        initializeKakao();
      } else {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
        script.onload = initializeKakao;
        document.head.appendChild(script);
      }
    }
  }, []);
  const handleShare = () => {
    if (!isKakaoLoaded || typeof window === "undefined" || !window.Kakao || !window.Kakao.Link) {
      console.error("Kakao SDK를 사용할 수 없습니다.");
      return;
    }
    window.Kakao.Link.sendDefault({
      objectType: "text",
      text: "친구에게 가고 싶은 장소를 공유해보세요",
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    });
  };
  return (
    <div
      onClick={handleShare}
      className="desktop:px-4 desktop:py-2  desktop:text-gray-950 desktop:rounded desktop:cursor-pointer desktop:bg-white"
    >
      <Image
        src="/assets/images/kakaoShare.png"
        alt="이미지가 없습니다"
        width={55}
        height={55}
        className="hover:cursor-pointer"
      />
    </div>
  );
};
export default KakaoShareButton;
