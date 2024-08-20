import { create } from "zustand";

type ModalState = {
  modals: Record<string, boolean>;
  toggleModal: (id: string) => void;
  resetModals: () => void;
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
  resetModals: () => set({ modals: {} }),
}));

export default useModalStore;
