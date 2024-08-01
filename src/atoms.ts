import { atom } from "recoil";

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const selectedUserIdState = atom({
  key: "selectedUserIdState",
  default: "",
});

export const selectedUserIndexState = atom({
  key: "selectedUserIndex",
  default: 0,
});

export const presenceState = atom<Test>({
  key: "presenceState",
  default: {
    "": [
      {
        onlineAt: "",
        presence_ref: "",
      },
    ],
  },
});

type Test = {
  [key: string]: PreArr[];
};

type PreArr = {
  onlineAt: string;
  presence_ref: string;
};
