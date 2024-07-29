import Image from "next/image";

interface ContentDetailProps {
  title: string;
  addr1: string;
  tel: string;
  homepageLink: string | null;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ title, addr1, tel, homepageLink }) => {
  return (
    <div className="text-left">
      <div className="flex item-center gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="장소명" width={10} height={10} />
        <strong>장소명 :</strong> {title}
      </div>
      <div className="flex item-center gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="주소" width={10} height={10} />
        <strong>주소:</strong> {addr1}
      </div>
      <div className="flex item-center gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="tel" width={10} height={10} />
        <strong>tel:</strong> {tel}
      </div>
      <div className="flex item-center gap-6 py-2">
        <Image src="/assets/images/smallMaker.png" alt="homepage" width={10} height={10} />
        <strong>homepage: </strong>
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
