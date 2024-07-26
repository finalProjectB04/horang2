import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <div className="flex-shrink-0">
    <Link href="/">
      <Image
        src="/assets/images/header/header_logo.png"
        alt="MyLogo"
        width={178}
        height={60}
        className="cursor-pointer"
      />
    </Link>
  </div>
);

export default Logo;
