import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UserState = {
  id: string | null;
  user_email: string | null;
  user_nickname: string | null;
  profile_url: string | null;
  setUser: (id: string, user_email: string, user_nickname: string, profile_url: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    id: null,
    user_email: null,
    user_nickname: null,
    profile_url: null,
    setUser: (id, user_email, user_nickname, profile_url) => set({ id, user_email, user_nickname, profile_url }),
    clearUser: () => set({ id: null, user_email: null, user_nickname: null, profile_url: null }),
  })),
);
