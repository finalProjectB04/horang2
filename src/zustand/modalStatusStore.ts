import { create } from "zustand";

type ModalState = {
  modals: Record<string, boolean>;
  toggleModal: (id: string) => void;
};

const useModalStore = create<ModalState>((set) => ({
  modals: {},
  toggleModal: (id: string) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: !state.modals[id],
      },
    })),
}));

export default useModalStore;
