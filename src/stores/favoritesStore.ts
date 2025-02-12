import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteLocation {
  id: string;
  name: string | undefined;
  lat: number;
  lon: number;
}

interface FavoritesStore {
  favorites: FavoriteLocation[];
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (location) =>
        set((state) => ({ favorites: [...state.favorites, location] })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        })),
    }),
    {
      name: 'favorites-storage'
    }
  )
);