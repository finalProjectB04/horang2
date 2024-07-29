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

  const formattedOverview = splitText(overview, 50);

  return (
    <section className="w-full max-w-[1440px] mt-4 text-left py-12">
      <div className="text-start">
        <h1 className="text-3xl font-bold py-5">overview:</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {showMore ? <p>{formattedOverview}</p> : <p>{formattedOverview.substring(0, 400)}...</p>}
        </div>
        {overview.length > 200 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleShowMore}
              className="px-12 py-5 text-orange-600 font-black bg-white rounded-lg border border-orange-300"
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
