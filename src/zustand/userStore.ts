import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserState = {
  id: string | null;
  user_email: string | null;
  user_nickname: string | null;
  profile_url: string | null;
  user_address: string | null;
  setUser: (id: string, user_email: string, user_nickname: string, profile_url: string, user_address: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        id: null,
        user_email: null,
        user_nickname: null,
        profile_url: null,
        user_address: null,
        setUser: (id, user_email, user_nickname, profile_url, user_address) =>
          set({ id, user_email, user_nickname, profile_url, user_address }),
        clearUser: () =>
          set({ id: null, user_email: null, user_nickname: null, profile_url: null, user_address: null }),
      }),
      {
        name: "user-storage",
      },
    ),
  ),
);
