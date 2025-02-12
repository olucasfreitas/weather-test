import { create } from 'zustand';

interface Coordinates {
  lat?: number;
  lon?: number;
}

interface CoordinatesState extends Coordinates {
  setCoordinates: (lat: number, lon: number) => void;
  resetCoordinates: () => void;
}

export const useCoordinatesStore = create<CoordinatesState>((set) => ({
  lat: undefined,
  lon: undefined,
  setCoordinates: (lat: number, lon: number) => set({ lat, lon }),
  resetCoordinates: () => set({ lat: undefined, lon: undefined }),
}));