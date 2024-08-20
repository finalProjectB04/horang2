import { useModal } from "@/context/modal.context";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FloatingButton = () => {
  const { id: userId } = useUserStore();
  const modal = useModal();
  const router = useRouter();

  const handleClick = async () => {
    if (!userId) {
      await modal.open({
        title: "",
        content: "로그인이 필요합니다.",
      });
      router.push("signin");
    } else {
      router.push("/chat");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-[2%] bottom-[17%] rounded-ful lg:flex lg:flex-col lg:items-center z-50"
    >
      <Image
        className="opacity-70  hover:opacity-90"
        src="/assets/images/chat.png"
        alt="채팅하기"
        width={40}
        height={40}
      />
      <span className="font-extrabold text-secondary-800">chat</span>
    </button>
  );
};

export default FloatingButton;
