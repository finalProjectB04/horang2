import { create } from "zustand";
import Cookies from "js-cookie";

type UserState = {
  id: string | null;
  user_email: string | null;
  user_nickname: string | null;
  profile_url: string | null;
  setUser: (id: string, user_email: string, user_nickname: string, profile_url: string) => void;
  clearUser: () => void;
};

const getInitialState = (): Omit<UserState, "setUser" | "clearUser"> => {
  const cookie = Cookies.get("user-storage");
  if (cookie) {
    try {
      return JSON.parse(cookie);
    } catch {
      return {
        id: null,
        user_email: null,
        user_nickname: null,
        profile_url: null,
      };
    }
  }
  return {
    id: null,
    user_email: null,
    user_nickname: null,
    profile_url: null,
  };
};

export const useUserStore = create<UserState>((set) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    setUser: (id, user_email, user_nickname, profile_url) => {
      const newState = { id, user_email, user_nickname, profile_url };
      set(newState);
      Cookies.set("user-storage", JSON.stringify(newState), { expires: 7 });
    },
    clearUser: () => {
      set({ id: null, user_email: null, user_nickname: null, profile_url: null });
      Cookies.remove("user-storage");
    },
  };
});
