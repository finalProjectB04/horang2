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
      <div className="flex items-center gap-12 py-2">
        <Image src="/assets/images/smallMaker.png" alt="장소명" width={18} height={27} />
        <strong className="font-bold text-[28px] ml-2">장소명</strong>
        <span className="text-[24px] font-normal ml-10">{title}</span>
      </div>
      <div className="flex items-center gap-12 py-2">
        <Image src="/assets/images/smallMaker.png" alt="주소" width={18} height={27} />
        <strong className="font-bold text-[28px] ml-2">주소</strong>
        <span className="text-[24px] font-normal ml-10">{addr1}</span>
      </div>
      <div className="flex items-center gap-12 py-2">
        <Image src="/assets/images/smallMaker.png" alt="tel" width={18} height={27} />
        <strong className="font-bold text-[28px] ml-2">tel</strong>
        <span className="text-[24px] font-normal ml-10">{tel}</span>
      </div>
      <div className="flex items-center gap-12 py-2">
        <Image src="/assets/images/smallMaker.png" alt="homepage" width={18} height={27} />
        <strong className="font-bold text-[28px] ml-2">homepage</strong>
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
