import Link from "next/link";
import Image from "next/image";

const MobileLogo = () => (
  <div className="flex-shrink-0">
    <Link href="/">
      <Image src="/assets/images/logo.svg" alt="MyLogo" width={150} height={60} className="cursor-pointer" />
    </Link>
  </div>
);

export default MobileLogo;
