import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useModal } from "@/context/modal.context";

const FloatingButton = () => {
  const { id: userId } = useUserStore();
  const router = useRouter();
  const modal = useModal();

  const handleClick = () => {
    if (!userId) {
      modal.open({
        title: "로그인 해주세요",
        content: (
          <div className="text-center">
            <p>로그인 유저만 </p>
            <p> 이용 가능합니다</p>
          </div>
        ),
      });
    } else {
      router.push("/chat");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-[2%] bottom-[7%] rounded-ful lg:flex lg:flex-col lg:items-center z-50"
    >
      <Image className="opacity-80" src="/assets/images/chat.png" alt="채팅하기" width={40} height={40} />
      <span className="font-extrabold text-secondary-800">chat</span>
    </button>
  );
};

export default FloatingButton;
