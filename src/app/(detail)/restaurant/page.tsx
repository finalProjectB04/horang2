import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Restaurant = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList
          contentTypeId={39}
          title="음식점 추천"
          contentId={""}
          imageUrl={""}
          addr1={""}
          tel={""}
          user_id={""}
        />
        ;
      </div>
      <div className="block lg:hidden ">
        <TourismListMobile contentTypeId={39} title="음식점 추천" />
      </div>
    </>
  );
};

export default Restaurant;
