import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Restaurant = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList contentTypeId={39} title="음식점 추천" />;
      </div>
      <div className="block lg:hidden sm:hidden">
        <TourismListMobile contentTypeId={39} title="음식점 추천" />
      </div>
    </>
  );
};

export default Restaurant;
