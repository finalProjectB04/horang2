import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Hotel = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList
          contentTypeId={32}
          title="숙소 추천"
          contentId={""}
          imageUrl={""}
          addr1={""}
          tel={""}
          user_id={""}
        />
        ;
      </div>
      <div className="block lg:hidden ">
        <TourismListMobile contentTypeId={32} title="숙소 추천" />
      </div>
    </>
  );
};

export default Hotel;
