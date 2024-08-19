export const SkeletonCard: React.FC = () => (
  <div className="bg-grey-200 w-[104px] h-[166px] lg:w-[220px] lg:h-[280px] rounded-[8px] animate-pulse">
    <div className="h-3/4 bg-grey-300 rounded-t-[8px]"></div>
    <div className="h-1/4 p-2">
      <div className="h-4 bg-grey-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-grey-300 rounded w-1/2"></div>
    </div>
  </div>
);
