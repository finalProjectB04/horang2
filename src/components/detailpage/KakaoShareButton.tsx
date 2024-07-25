"use client";

import Image from "next/image";
import { useEffect } from "react";

interface KakaoShareButtonProps {
  id: string;
}

const KakaoShareButton = ({ id }: KakaoShareButtonProps) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${id}/detailpage`;

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
      script.onload = () => {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
      };
      document.head.appendChild(script);
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
    }
  }, []);

  const handleShare = () => {
    if (typeof window === "undefined" || !window.Kakao || !window.Kakao.isInitialized()) {
      console.error("Kako SDK를 사용 할 수 없습니다.");
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
    <div onClick={handleShare} className="px-4 py-2 bg-slate-200 text-gray-950 rounded">
      <Image src="/assets/images/KakaoShare.png" alt="이미지가 없습니다" width={55} height={55} />
    </div>
  );
};

export default KakaoShareButton;
