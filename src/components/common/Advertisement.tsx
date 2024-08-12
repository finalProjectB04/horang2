import Image from "next/image";
import React from "react";
import banner from "../../../public/assets/images/banner.jpg";
import banner2 from "../../../public/assets/images/banner2.png";

const Advertisement: React.FC = () => {
  return (
    <section className="sm:my-[20px] md:my-[50px] lg:my-[100px]">
      <Image className="sm:block lg:hidden" src={banner2} alt={"banner2"} width={375} height={140} />
      <Image className="sm:hidden lg:block" src={banner} alt={"banner"} width={1920} height={360} />
    </section>
  );
};

export default Advertisement;
