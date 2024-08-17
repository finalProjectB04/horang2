import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Festival = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList
          contentTypeId={15}
          title="축제 및 공연 추천"
          contentId={""}
          imageUrl={""}
          addr1={""}
          tel={""}
          user_id={""}
        />
        ;
      </div>
      <div className="block lg:hidden ">
        <TourismListMobile contentTypeId={15} title="축제 및 공연 추천" />
      </div>
    </>
  );
};

export default Festival;
