import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Leports = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList
          contentTypeId={28}
          title="놀거리 추천"
          contentId={""}
          imageUrl={""}
          addr1={""}
          tel={""}
          user_id={""}
        />
        ;
      </div>
      <div className="block lg:hidden ">
        <TourismListMobile contentTypeId={28} title="놀거리 추천" />
      </div>
    </>
  );
};

export default Leports;
