import Image from "next/image";

interface ContentDetailProps {
  title: string;
  addr1: string;
  tel: string;
  homepageLink: string | null;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ title, addr1, tel, homepageLink }) => {
  return (
    <div className="text-left text-grey-700">
      <div className="flex gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="장소명" width={18} height={27} />
        <strong className="font-black text-xl">장소명</strong> {title}
      </div>
      <div className="flex gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="주소" width={18} height={27} />
        <strong className="font-black text-xl">주소</strong> {addr1}
      </div>
      <div className="flex gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="tel" width={18} height={27} />
        <strong className="font-bold text-xl">tel</strong> {tel}
      </div>
      <div className="flex gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="homepage" width={18} height={27} />
        <strong className="font-bold text-xl">homepage </strong>
        {homepageLink && (
          <a href={homepageLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {homepageLink}
          </a>
        )}
      </div>
    </div>
  );
};

export default ContentDetail;
