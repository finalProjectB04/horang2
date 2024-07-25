import Link from "next/link";

const Nav = () => (
  <nav className="ml-auto flex items-center space-x-4">
    <Link href="/travel-recommendations">
      <span className="text-primary hover:text-gray-400 cursor-pointer">여행지 추천</span>
    </Link>
    <Link href="/hot-places">
      <span className="text-primary hover:text-gray-400 cursor-pointer">내 근처 핫 플레이스</span>
    </Link>
    <Link href="/custom-itinerary">
      <span className="text-primary hover:text-gray-400 cursor-pointer">내 취향 코스 짜기</span>
    </Link>
    <Link href="/mypage">
      <span className="text-primary hover:text-gray-400 cursor-pointer">마이페이지</span>
    </Link>
  </nav>
);

export default Nav;
