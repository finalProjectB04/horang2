import create from "zustand";

type LocationState = {
  latitude: number;
  longitude: number;
  setLocation: (latitude: number, longitude: number) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  latitude: 0,
  longitude: 0,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
}));
