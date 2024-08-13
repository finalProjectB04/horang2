import Image from "next/image";

interface ContentDetailProps {
  title: string | null;
  addr1: string | null;
  tel: string | null;
  homepageLink: string | null;
  contenttypeid: string | null;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ title, addr1, tel, homepageLink, contenttypeid }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getContentTypeName = (id: string | null) => {
    switch (id) {
      case "12":
        return "관광지";
      case "14":
        return "문화시설";
      case "15":
        return "축제/공연/행사";
      case "25":
        return "여행코스";
      case "28":
        return "레포츠";
      case "32":
        return "숙박";
      case "38":
        return "쇼핑";
      case "39":
        return "음식";
      default:
        return "기타";
    }
  };

  return (
    <div className="text-left text-grey-700 ">
      {contenttypeid && (
        <div className="flex items-center py-3 sm:mb-2">
          <Image
            src="/assets/images/detailpage/marker_title.svg"
            alt="컨텐츠타입"
            width={32}
            height={32}
            className="sm:w-5 sm:h-5"
          />
          <span className="ml-4 sm:text-[12px] sm:ml-2 md:text-lg lg:text-xl font-normal text-grey-600">
            {getContentTypeName(contenttypeid)}
          </span>
        </div>
      )}

      {addr1 && (
        <div className="flex items-center py-3 sm:mb-2">
          <Image
            src="/assets/images/detailpage/marker_address.svg"
            alt="주소"
            width={32}
            height={32}
            className="sm:w-5 sm:h-5"
          />
          <span className="ml-4 sm:text-[12px] sm:ml-2 md:text-lg lg:text-xl font-normal text-grey-600">{addr1}</span>
        </div>
      )}

      {tel && (
        <div className="flex items-center py-3 sm:mb-2">
          <Image
            src="/assets/images/detailpage/marker_tel.svg"
            alt="전화번호"
            width={32}
            height={32}
            className="sm:w-5 sm:h-5"
          />
          <span className="ml-4 sm:text-[12px] sm:ml-2 md:text-lg lg:text-xl font-normal text-grey-600">{tel}</span>
        </div>
      )}

      {homepageLink && (
        <div className="flex items-center py-3 sm:mb-2">
          <Image
            src="/assets/images/detailpage/marker_homepage.svg"
            alt="홈페이지"
            width={32}
            height={32}
            className="sm:w-5 sm:h-5"
          />
          <a
            href={homepageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 sm:text-[12px] sm:ml-2 md:text-lg lg:text-xl font-normal text-blue-500 underline"
          >
            <span className="sm:hidden md:inline lg:inline">{homepageLink}</span>
            <span className="sm:inline md:hidden lg:hidden">{truncateText(homepageLink, 50)}</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
