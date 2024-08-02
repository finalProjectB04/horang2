import { splitText } from "@/utils/detailpage/StringUtils";
import { useState } from "react";

interface ContentOverviewProps {
  overview: string;
}

const ContentOverview: React.FC<ContentOverviewProps> = ({ overview }) => {
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const formattedOverview = splitText(overview, 70);

  return (
    <section className="w-full max-w-[1440px] mt-4 text-left py-12">
      <div className="text-start">
        <h1 className="text-3xl font-bold py-12">overview</h1>
        <div className="text-grey-700" style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? <p>{formattedOverview}</p> : <p>{formattedOverview.substring(0, 400)}...</p>}
        </div>
        {overview.length > 200 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleShowMore}
              className="px-16 py-6 text-2xl text-primary-500 font-black bg-white rounded-xl border border-primary-200"
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
