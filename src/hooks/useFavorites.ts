import { useFavoritesStore } from '../stores/favoritesStore';

export const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

  const isFavorite = (id: string) => favorites.some((fav) => fav.id === id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};