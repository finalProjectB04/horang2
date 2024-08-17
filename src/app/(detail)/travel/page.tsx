import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Travel = () => {
  return (
    <>
      <div className="hidden lg:block">
        <TourismList contentTypeId={12} title="관광지 추천" />;
      </div>
      <div className="block lg:hidden ">
        <TourismListMobile contentTypeId={12} title="관광지 추천" />
      </div>
    </>
  );
};

export default Travel;
