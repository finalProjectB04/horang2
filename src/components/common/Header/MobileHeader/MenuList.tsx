import Link from "next/link";

interface MenuListProps {
  userId: string | null;
  handleLogout: () => void;
  toggleMenu: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ userId, handleLogout, toggleMenu }) => {
  return (
    <div
      className="absolute top-0 left-0 h-full bg-white shadow-lg flex flex-col p-4 space-y-4 menu-content"
      style={{ width: "321px" }}
    >
      <button className="text-[#FF7C33] self-end text-2xl" onClick={toggleMenu}>
        <span className="text-2xl">&#9776;</span>
      </button>

      <Link href="/intro">
        <span className="text-black hover:text-gray-400 cursor-pointer">호랑 소개</span>
      </Link>
      <Link href="/travel">
        <span className="text-black hover:text-gray-400 cursor-pointer">추천 여행지</span>
      </Link>
      <Link href="/hotel">
        <span className="text-black hover:text-gray-400 cursor-pointer">숙소</span>
      </Link>
      <Link href="/leports">
        <span className="text-black hover:text-gray-400 cursor-pointer">레포츠</span>
      </Link>
      <Link href="/restaurant">
        <span className="text-black hover:text-gray-400 cursor-pointer">음식점</span>
      </Link>
      <Link href="/festival">
        <span className="text-black hover:text-gray-400 cursor-pointer">축제 및 행사</span>
      </Link>
      <Link href="/location">
        <span className="text-black hover:text-gray-400 cursor-pointer">내 근처 여행지</span>
      </Link>
      <Link href="/travelMbti">
        <span className="text-black hover:text-gray-400 cursor-pointer">나만의 여행</span>
      </Link>
      <Link href="/mypage">
        <span className="text-black hover:text-gray-400 cursor-pointer">나의 공간</span>
      </Link>
      <Link href="/community">
        <span className="text-black hover:text-gray-400 cursor-pointer">호랑이 모임</span>
      </Link>

      <div className="space-y-2">
        {userId ? (
          <button onClick={handleLogout} className="text-black hover:text-gray-400 cursor-pointer block">
            로그아웃
          </button>
        ) : (
          <>
            <Link href="/signin">
              <span className="text-black hover:text-gray-400 cursor-pointer block">로그인</span>
            </Link>
            <Link href="/signup">
              <span className="text-black hover:text-gray-400 cursor-pointer block" style={{ marginTop: "8px" }}>
                회원가입
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuList;
