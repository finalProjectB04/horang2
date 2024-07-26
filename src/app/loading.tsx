import Image from "next/image";
import logo from "../../public/assets/images/logo.svg";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center gap-2 text-3xl font-semibold bg-white z-50">
      <div className="flex gap-5">
        <Image width={85} height={85} className="object-cover animate-spin" sizes="100%" src={logo} alt="호랑이" />
      </div>
      <p className="animate mt-5">잠시만 기다려주세요</p>
    </div>
  );
};

export default LoadingPage;
