"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoShareButtonProps {
  id: string;
}

const KakaoShareButton = ({ id }: KakaoShareButtonProps) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${id}/detailpage`;
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const initializeKakao = () => {
      if (window.kakao) {
        if (!window.kakao.isInitialized()) {
          window.kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
        setIsKakaoLoaded(true);
      }
    };

    if (typeof window !== "undefined") {
      if (window.kakao) {
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
    if (!isKakaoLoaded || typeof window === "undefined" || !window.kakao || !window.kakao.Link) {
      console.error("Kakao SDK를 사용할 수 없습니다.");
      return;
    }

    window.kakao.Link.sendDefault({
      objectType: "text",
      text: "친구에게 가고 싶은 장소를 공유해보세요",
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    });
  };

  return (
    <div onClick={handleShare} className="px-4 py-2 bg-slate-200 text-gray-950 rounded cursor-pointer">
      <Image src="/assets/images/KakaoShare.png" alt="이미지가 없습니다" width={55} height={55} />
    </div>
  );
};

export default KakaoShareButton;
