"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const validPathnames = ["/", "/mypage", "/community"];

  if (!validPathnames.includes(pathname)) {
    return null;
  }
  return (
    <footer className="bottom-0 w-full left-0 z-50 text-white  bg-cover bg-center bg-[url('/assets/images/header/header.png')]  bg-secondary-800 mt-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-col items-center">
          <div className="py-4">
            <Image src="/assets/images/logo.svg" alt="MyLogo" width={176} height={60} className="cursor-pointer" />
          </div>
          {/* <nav className="lg:w-44 lg:mb-0">
            <ul className="flex flex-wrap items-center gap-6">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/travel" className="text-gray-400 hover:text-white">
                  여행
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  소개
                </Link>
              </li>
            </ul>
          </nav> */}
          <div className="lg:w-44 flex gap-4"></div>
        </div>
        <div className="flex justify-center items-center">
          <p className="flex flex-row items-center text-gray-400 hover:text-white">
            <Link href="https://github.com/finalProjectB04/horang2" className="text-gray-400 hover:text-white mr-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <p className="text-[14px]">안종현 서예은 김지환 김운성 양대우</p>
            <svg
              className="w-4 h-4 text-gray-400 hover:text-white mr-2 ml-2"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448L64 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z" />
            </svg>
            <p className="text-[14px]">이지원</p>
          </p>
        </div>
        <div className="flex  justify-center text-center text-sm text-gray-400 pb-3">
          <p className="text-[12px] mt-1 mb-1">&copy; 2024 여행보내조. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
