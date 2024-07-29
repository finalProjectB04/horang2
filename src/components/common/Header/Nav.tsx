import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";

const Nav = () => {
  const router = useRouter();
  const { id: userId } = useUserStore((state) => ({
    id: state.id,
  }));

  const handleNavigation = (href: string) => (event: React.MouseEvent) => {
    if (!userId) {
      event.preventDefault();
      router.push("/signin");
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="ml-auto flex items-center space-x-4">
      <Link href="/travel-recommendations">
        <span
          className="text-primary hover:text-gray-400 cursor-pointer"
          onClick={handleNavigation("/travel-recommendations")}
        >
          여행지 추천
        </span>
      </Link>
      <Link href="/location">
        <span className="text-primary hover:text-gray-400 cursor-pointer" onClick={handleNavigation("/location")}>
          내 근처 핫 플레이스
        </span>
      </Link>
      <Link href="/custom-itinerary">
        <span
          className="text-primary hover:text-gray-400 cursor-pointer"
          onClick={handleNavigation("/custom-itinerary")}
        >
          내 취향 코스 짜기
        </span>
      </Link>
      <Link href="/mypage">
        <span className="text-primary hover:text-gray-400 cursor-pointer" onClick={handleNavigation("/mypage")}>
          마이페이지
        </span>
      </Link>
    </nav>
  );
};

export default Nav;
