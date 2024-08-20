import Image from "next/image";
import React from "react";

const MidImage = () => {
  return (
    <>
      <div className="my-[70px] hidden lg:block">
        <Image src="/assets/images/backgrounds/Group 11927.png" alt={"midimage"} width={1280} height={238} />
      </div>
      <div className="my-[64px] block lg:hidden">
        <Image src="/assets/images/backgrounds/Group 11927.png" alt={"midimage"} width={375} height={140} />
      </div>
    </>
  );
  ``;
};

export default MidImage;
