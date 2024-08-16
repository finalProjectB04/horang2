import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";

const useRedirectIfLoggedIn = () => {
  const router = useRouter();
  const { id: userId } = useUserStore();

  if (userId) {
    router.push("/");
  }
};

export default useRedirectIfLoggedIn;
