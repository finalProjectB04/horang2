import useShowMore from "@/hooks/detailpage/useShowMore";
import React from "react";

interface ContentOverviewProps {
  overview: string;
}

const ContentOverview: React.FC<ContentOverviewProps> = ({ overview }) => {
  const { showMore, toggleShowMore } = useShowMore();

  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const cleanedOverview = decodeHtmlEntities(overview.replace(/<br\s*\/?>/gi, "\n"));

  return (
    <section className="w-full mt-4 text-left py-12 md:w-full  md:max-w-[910px] md:mt-4 md:text-left md:py-8 lg:w-full lg:max-w-[1280px] lg:mt-4 lg:text-left lg:py-12 sm:px-[24px] sm:mt-[-30px]">
      <div className="text-start md:text-start">
        <h1 className="lg:text-[19px] font-bold py-5 md:text-[17px] md:font-bold  lg:font-bold lg:pb-[21px] sm:text-[14px]  sm:font-bold sm:leading-[24px]">
          개요
        </h1>
        <div className="text-grey-700" style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? (
            <p className="lg:text-[16px ]sm:leading-[24px] sm:tracking-[-0.3px] sm:text-[12px] sm:font-normal sm:grey-600">
              {cleanedOverview}
            </p>
          ) : (
            <p>{cleanedOverview.substring(0, 500)}...</p>
          )}
        </div>
        {overview.length > 500 && (
          <div className="flex justify-center md:flex md:justify-center lg:flex lg:justify-center pt-[96px]">
            <button
              onClick={toggleShowMore}
              className="
                         md:px-8 md:py-3 md:text-xl md:text-primary-500 md:font-bold sm:font-bold 
                         lg:px-8 lg:py-4 lg:text-[19px] text-primary-500 lg:font-black lg:bg-white rounded-xl border border-primary-200 
                        
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

export default React.memo(ContentOverview);
