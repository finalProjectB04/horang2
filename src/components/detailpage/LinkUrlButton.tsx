"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

const LinkUrlButton = () => {
  const params = useParams() as { contentId: string };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert(`${process.env.NEXT_PUBLIC_BASE_URL}/detail/${params.contentId} : 클립보드에 복사되었습니다.`);
  };

  const handleCopyClick = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${params.contentId}`;
    copyToClipboard(textToCopy);
  };
  return (
    <>
      <div onClick={handleCopyClick}>
        <div className="desktop:px-4 desktop:py-2 bg-slate-200 text-gray-950 desktop:rounded bg-white tablet:px-2 tablet:py-1">
          <Image
            src="/assets/images/linkUrl.png"
            alt="이미지가 없습니다"
            width={55}
            height={55}
            className="tablet:w-12 tablet:h-12"
          />
        </div>
      </div>
    </>
  );
};

export default LinkUrlButton;
