import Image from "next/image";

export const BackgroundImage: React.FC<{ img: string; children: React.ReactNode }> = ({ img, children }) => (
  <div className="flex flex-col justify-center items-center">
    <div className="relative lg:w-[1280px] lg:h-[600px] w-[375px] h-[302px]">
      <Image src={img} alt="background" layout="fill" objectFit="cover" className="object-cover" />
      <div className=" absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">{children}</div>
    </div>
  </div>
);
