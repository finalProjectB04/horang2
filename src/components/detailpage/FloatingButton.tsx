import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FloatingButton = () => {
  const { id: userId } = useUserStore();
  const router = useRouter();

  const handleClick = () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
    } else {
      router.push("/chat");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed text-white p-4 rounded-full text-gray-600 flex flex-col items-center z-50"
      style={{ right: "118px", bottom: "216px" }}
    >
      <Image src="/assets/images/profile_ex.png" alt="채팅하기" width={64} height={64} />
      <span className="mt-2 text-gray-600">chat</span>
    </button>
  );
};

export default FloatingButton;
