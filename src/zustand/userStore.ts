import { create } from "zustand";
import Cookies from "js-cookie";

type UserState = {
  id: string | null;
  user_email: string | null;
  user_nickname: string | null;
  profile_url: string | null;
  provider: string | null;
  provider_id: string | null;
  setUser: (
    id: string,
    user_email: string,
    user_nickname: string,
    profile_url: string,
    provider: string,
    provider_id: string,
  ) => void;
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
        provider: null,
        provider_id: null,
      };
    }
  }
  return {
    id: null,
    user_email: null,
    user_nickname: null,
    profile_url: null,
    provider: null,
    provider_id: null,
  };
};

export const useUserStore = create<UserState>((set) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    setUser: (id, user_email, user_nickname, profile_url, provider, provider_id) => {
      const newState = { id, user_email, user_nickname, profile_url, provider, provider_id };
      set(newState);
      Cookies.set("user-storage", JSON.stringify(newState), { expires: 7 });
    },
    clearUser: () => {
      set({ id: null, user_email: null, user_nickname: null, profile_url: null, provider: null, provider_id: null });
      Cookies.remove("user-storage");
    },
  };
});
