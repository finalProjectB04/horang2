import { TourismListMobile } from "@/components/maindetail/mainDetailMobile/TourismListMobile";
import { TourismList } from "@/components/maindetail/TourismList";

const Leports = () => {
  return (
    <>
      <div className=" hidden lg:block">
        <TourismList contentTypeId={28} title="레포츠 추천" />;
      </div>
      <div className="block lg:hidden sm:hidden">
        <TourismListMobile contentTypeId={28} title="레포츠 추천" />
      </div>
    </>
  );
};

export default Leports;
