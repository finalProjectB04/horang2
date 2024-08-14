// import { useUserStore } from "@/zustand/userStore";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const FloatingButton = () => {
//   const { id: userId } = useUserStore();
//   const router = useRouter();

//   const handleClick = () => {
//     if (!userId) {
//       alert("로그인이 필요합니다.");
//     } else {
//       router.push("/chat");
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="fixed text-white lg:p-4 rounded-full text-gray-600 lg:flex lg:flex-col lg:items-center z-50 sm:hidden"
//       style={{ right: "118px", bottom: "216px" }}
//     >
//       <Image src="/assets/images/profile_ex.png" alt="채팅하기" width={64} height={64} />
//       <span className="lg:mt-2 text-gray-600">chat</span>
//     </button>
//   );
// };

// export default FloatingButton;
