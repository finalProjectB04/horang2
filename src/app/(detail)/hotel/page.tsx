import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Hotel = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList contentTypeId={32} title="숙소 추천" />;
      </div>
      <div className="block lg:hidden sm:hidden">
        <TourismListMobile contentTypeId={32} title="숙소 추천" />
      </div>
    </>
  );
};

export default Hotel;
