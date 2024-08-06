import Image from "next/image";
import React from "react";
import banner from "../../../public/assets/images/banner.jpg";

const Advertisement: React.FC = () => {
  return (
    <section className="my-[100px]">
      <Image src={banner} alt={"banner"} width={1920} height={360} />;
    </section>
  );
};

export default Advertisement;
