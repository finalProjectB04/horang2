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
    <section className="w-full max-w-[1440px] mt-4 text-left py-12 tablet:w-full tablet:max-w-[1024px] tablet:mt-4 tablet:text-left tablet:py-8 desktop:w-full desktop:max-w-[1440px] desktop:mt-4 desktop:text-left desktop:py-12">
      <div className="text-start tablet:text-start">
        <h1 className="text-3xl font-bold py-12 tablet:text-2xl tablet:font-bold tablet:py-8 desktop:text-3xl desktop:font-bold desktop:py-12">
          overview
        </h1>
        <div className="text-grey-700" style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? <p>{overview}</p> : <p>{overview.substring(0, 500)}...</p>}
        </div>
        {overview.length > 500 && (
          <div className="flex justify-center mt-2 tablet:flex tablet:justify-center tablet:mt-2 desktop:flex desktop:justify-center desktop:mt-2">
            <button
              onClick={handleShowMore}
              className="px-16 py-6 text-2xl text-primary-500 font-black bg-white rounded-xl border border-primary-200 tablet:px-8 tablet:py-3 tablet:text-xl tablet:text-primary-500 tablet:font-bold desktop:px-16 desktop:py-6 desktop:text-2xl desktop:text-primary-500 desktop:font-black desktop:bg-white desktop:rounded-xl desktop:border desktop:border-primary-200"
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
