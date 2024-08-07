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
    <section className="desktop:w-full desktop:max-w-[1440px] desktop:mt-4 desktop:text-left desktop:py-12">
      <div className="desktop:text-start">
        <h1 className="desktop:text-3xl desktop:font-bold desktop:py-12">overview</h1>
        <div className="text-grey-700" style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? <p>{overview}</p> : <p>{overview.substring(0, 500)}...</p>}
        </div>
        {overview.length > 500 && (
          <div className="desktop:flex desktop:justify-center desktop:mt-2">
            <button
              onClick={handleShowMore}
              className="desktop:px-16 desktop:py-6 desktop:text-2xl desktop:text-primary-500 desktop:font-black desktop:bg-white desktop:rounded-xl desktop:border desktop:border-primary-200"
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
