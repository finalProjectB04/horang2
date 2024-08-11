import { create } from "zustand";

type Presence = {
  [key: string]: PreArr[];
};

type PreArr = {
  onlineAt: string;
  presence_ref: string;
};

type ChatState = {
  selectedUserId: string;
  setSelectedUserId: (newId: string) => void;

  selectedUserIndex: number;
  setSelectedUserIndex: (newIndex: number) => void;

  presence: Presence;
  setPresence: (newPresence: Presence) => void;
};

const useChatStore = create<ChatState>((set) => ({
  selectedUserId: "",
  setSelectedUserId: (newId) => set({ selectedUserId: newId }),

  selectedUserIndex: 0,
  setSelectedUserIndex: (newIndex) => set({ selectedUserIndex: newIndex }),

  presence: {
    "": [
      {
        onlineAt: "",
        presence_ref: "",
      },
    ],
  },
  setPresence: (newPresence) => set({ presence: newPresence }),
}));

export default useChatStore;
