import Image from "next/image";

const IntroPage = () => {
  return (
    <div className="relative h-screen bg-third-800">
      <Image
        className="sm:hidden md:block lg:block w-full"
        src="/assets/images/intro.png"
        width={1920}
        height={800}
        alt="호랑 구성"
      />
      <Image
        className="sm:block md:hidden lg:hidden w-full"
        src="/assets/images/intro.png"
        width={400}
        height={190}
        alt="호랑 구성"
      />
      <div className="absolute inset-0 h-full bg-primary-900 opacity-40"></div>
      <div className="absolute inset-0 flex justify-center items-center">
        <p className="text-white font-extrabold sm:text-xl md:text-2xl lg:text-3xl">개발 중입니다.</p>
      </div>
    </div>
  );
};

export default IntroPage;
