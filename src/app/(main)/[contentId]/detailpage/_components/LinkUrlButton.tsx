"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

const LinkUrlButton = () => {
  const params = useParams() as { contentId: string };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert(`${process.env.NEXT_PUBLIC_BASE_URL}/${params.contentId}/detailpage : 클립보드에 복사되었습니다.`);
  };

  const handleCopyClick = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.contentId}/detailpage`;
    copyToClipboard(textToCopy);
  };
  return (
    <>
      <div onClick={handleCopyClick}>
        <div className="px-4 py-2 bg-slate-200 text-gray-950 rounded">
          <Image src="/assets/images/linkUrl.png" alt="이미지가 없습니다" width={30} height={30} />
        </div>
      </div>
    </>
  );
};

export default LinkUrlButton;
