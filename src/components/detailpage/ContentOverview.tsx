import { useState } from "react";

interface ContentOverviewProps {
  overview: string;
}

const ContentOverview: React.FC<ContentOverviewProps> = ({ overview }) => {
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="w-full max-w-[1440px] mt-4 text-left py-12 md:w-full md:max-w-[1024px] md:mt-4 md:text-left md:py-8 lg:w-full lg:max-w-[1440px] lg:mt-4 lg:text-left lg:py-12 sm:px-[24px] sm:mt-[-30px]">
      <div className="text-start md:text-start">
        <h1 className="text-3xl font-bold py-12 md:text-[30px] md:font-bold lg:text-[38px] lg:font-bold lg:pb-[65px] sm:text-[14px] sm:mb-[-30px] sm:font-bold sm:leading-[24px]">
          개요
        </h1>
        <div className="text-grey-700" style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? (
            <p className="sm:leading-[24px] sm:tracking-[-0.3px] sm:text-[12px] sm:font-normal sm:grey-600">
              {overview}
            </p>
          ) : (
            <p>{overview.substring(0, 500)}...</p>
          )}
        </div>
        {overview.length > 500 && (
          <div className="flex justify-center md:flex md:justify-center lg:flex lg:justify-center">
            <button
              onClick={handleShowMore}
              className="px-16 py-6 text-2xl text-primary-500 font-black bg-white rounded-xl border border-primary-200 
                         md:px-8 md:py-3 md:text-xl md:text-primary-500 md:font-bold 
                         lg:px-16 lg:py-6 lg:text-2xl lg:text-primary-500 lg:font-black lg:bg-white lg:rounded-xl lg:border lg:border-primary-200 
                         /** 모바일 버튼 스타일 **/
                         sm:px-4 sm:py-2 sm:text-[14px] sm:rounded-lg"
            >
              {showMore ? "접기" : "더보기"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentOverview;
