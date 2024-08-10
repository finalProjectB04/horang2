import Image from "next/image";

interface ContentDetailProps {
  title: string | null;
  addr1: string | null;
  tel: string | null;
  homepageLink: string | null;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ title, addr1, tel, homepageLink }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="md:text-left md:text-grey-700 lg:text-left lg:text-grey-700 sm:text-left">
      {title && (
        <div className="md:flex md:items-center md:py-2 lg:flex lg:items-center lg:py-3 sm:flex sm:mb-[10px]">
          <Image
            src="/assets/images/detailpage/marker_title.svg"
            alt="장소명"
            width={32}
            height={32}
            className="sm:w-[20px] sm:h-[20px]"
          />
          <span className="md:text-[20px] md:font-normal md:ml-8 lg:text-[28px] lg:font-normal lg:ml-12 sm:text-grey-600 sm:font-normal sm:text-[12px] sm:pl-2">
            {title}
          </span>
        </div>
      )}

      {addr1 && (
        <div className="md:flex md:items-center md:py-2 lg:flex lg:items-center lg:py-3 sm:flex sm:mb-[10px]">
          <Image
            src="/assets/images/detailpage/marker_address.svg"
            alt="주소"
            width={32}
            height={32}
            className="sm:w-[20px] sm:h-[20px]"
          />
          <span className="md:text-[20px] md:font-normal md:ml-8 lg:text-[28px] lg:font-normal lg:ml-12 sm:text-[12px] sm:text-grey-600 sm:font-normal sm:pl-2">
            {addr1}
          </span>
        </div>
      )}
      {tel && (
        <div className="md:flex md:items-center md:py-2 lg:flex lg:items-center lg:py-3 sm:flex sm:mb-[10px]">
          <Image
            src="/assets/images/detailpage/marker_tel.svg"
            alt="tel"
            width={32}
            height={32}
            className="sm:w-[20px] sm:h-[20px]"
          />
          <span className="md:text-[20px] md:font-normal md:ml-8 lg:text-[28px] lg:font-normal lg:ml-12 sm:text-[12px] sm:text-grey-600 sm:font-normal sm:pl-2">
            {tel}
          </span>
        </div>
      )}
      {homepageLink && (
        <div className="md:flex md:items-center md:py-2 lg:flex lg:items-center lg:py-3 sm:flex sm:mb-[10px]">
          <Image
            src="/assets/images/detailpage/marker_homepage.svg"
            alt="homepage"
            width={32}
            height={32}
            className="sm:w-[20px] sm:h-[20px]"
          />
          <a
            href={homepageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="md:text-blue-500 md:underline md:text-[20px] lg:text-blue-500 lg:underline md:ml-8 lg:ml-12 lg:text-[28px] sm:text-[12px] sm:text-grey-600 sm:font-normal sm:pl-2"
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
