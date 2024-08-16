import Image from "next/image";

const Advertisement: React.FC = () => {
  return (
    <section className="sm:my-[10px] md:my-[20px] lg:my-[30px]">
      <Image
        className="sm:block md:hidden lg:hidden"
        src="/assets/images/banner2.png"
        alt={"banner2"}
        width={375}
        height={140}
      />
      <Image
        className="sm:hidden md:block lg:block"
        src="/assets/images/banner.jpg"
        alt={"banner"}
        width={1280}
        height={360}
      />
    </section>
  );
};

export default Advertisement;
