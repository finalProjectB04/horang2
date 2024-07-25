import Image from "next/image";

export const MainImage = () => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Image src="/assets/images/ex3.png" alt="background" width={1920} height={1080} className="w-full h-auto" />
        <div className="absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto my-36"></div>
        </div>
      </div>
    </div>
  );
};
