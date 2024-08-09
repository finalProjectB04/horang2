import Image from "next/image";

interface ContentDetailProps {
  title: string | null;
  addr1: string | null;
  tel: string | null;
  homepageLink: string | null;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ title, addr1, tel, homepageLink }) => {
  return (
    <div className="tablet:text-left tablet:text-grey-700 desktop:text-left desktop:text-grey-700 mobile:text-left">
      {title && (
        <div className="tablet:flex tablet:items-center tablet:py-2 desktop:flex desktop:items-center desktop:py-3 mobile:flex">
          <Image
            src="/assets/images/detailpage/marker_title.svg"
            alt="장소명"
            width={32}
            height={32}
            className="mobile:w-[20px] mobile:h-[20px]"
          />
          {/* <strong className="tablet:font-bold tablet:text-[24px] tablet:ml-2 desktop:font-bold desktop:text-[28px] desktop:ml-2">
        장소명
      </strong> */}
          <span className="tablet:text-[20px] tablet:font-normal tablet:ml-8 desktop:text-[28px] desktop:font-normal desktop:ml-12 mobile:text-grey-600 mobile:font-normal mobile:text-[12px] mobile:pl-2">
            {title}
          </span>
        </div>
      )}

      {addr1 && (
        <div className="tablet:flex tablet:items-center tablet:py-2 desktop:flex desktop:items-center desktop:py-3 mobile:flex">
          <Image
            src="/assets/images/detailpage/marker_address.svg"
            alt="주소"
            width={32}
            height={32}
            className="mobile:w-[20px] mobile:h-[20px]"
          />
          {/* <strong className="tablet:font-bold tablet:text-[24px] tablet:ml-2 desktop:font-bold desktop:text-[28px] desktop:ml-2">
          주소
        </strong> */}
          <span className="tablet:text-[20px] tablet:font-normal tablet:ml-8 desktop:text-[28px] desktop:font-normal desktop:ml-12 mobile:text-[12px] mobile:text-grey-600 mobile:font-normal mobile:pl-2">
            {addr1}
          </span>
        </div>
      )}
      {tel && (
        <div className="tablet:flex tablet:items-center tablet:py-2 desktop:flex desktop:items-center desktop:py-3 mobile:flex">
          <Image
            src="/assets/images/detailpage/marker_tel.svg"
            alt="tel"
            width={32}
            height={32}
            className="mobile:w-[20px] mobile:h-[20px]"
          />
          {/* <strong className="tablet:font-bold tablet:text-[24px] tablet:ml-2 desktop:font-bold desktop:text-[28px] desktop:ml-2">
          tel
        </strong> */}
          <span className="tablet:text-[20px] tablet:font-normal tablet:ml-8 desktop:text-[28px] desktop:font-normal desktop:ml-12 mobile:text-[12px] mobile:text-grey-600 mobile:font-normal mobile:pl-2">
            {tel}
          </span>
        </div>
      )}
      {homepageLink && (
        <div className="tablet:flex tablet:items-center tablet:py-2 desktop:flex desktop:items-center desktop:py-3 mobile:flex">
          <Image
            src="/assets/images/detailpage/marker_homepage.svg"
            alt="homepage"
            width={32}
            height={32}
            className="mobile:w-[20px] mobile:h-[20px]"
          />
          {/* <strong className="tablet:font-bold tablet:text-[24px] tablet:ml-2 desktop:font-bold desktop:text-[28px] desktop:ml-2">
          homepage
        </strong> */}
          {homepageLink && (
            <a
              href={homepageLink}
              target="_blank"
              rel="noopener noreferrer"
              className="tablet:text-blue-500 tablet:underline tablet:text-[20px] desktop:text-blue-500 desktop:underline tablet:ml-8 desktop:ml-12 desktop:text-[28px] mobile:text-[12px] mobile:text-grey-600 mobile:font-normal mobile:pl-2"
            >
              {homepageLink}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
