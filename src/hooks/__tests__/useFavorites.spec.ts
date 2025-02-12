import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavorites } from '../useFavorites';
import { useFavoritesStore } from '../../stores/favoritesStore';

vi.mock('../../stores/favoritesStore', () => ({
  useFavoritesStore: vi.fn()
}));

describe('useFavorites', () => {
  const mockFavorite = {
    id: '1',
    name: 'Favorite Place',
    lat: 12.34,
    lon: 56.78,
  };

  beforeEach(() => {
    vi.mocked(useFavoritesStore).mockReturnValue({
      favorites: [mockFavorite],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });
  });

  it('should return favorites from the store', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([mockFavorite]);
  });

  it('should check if an item is favorite', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.isFavorite('2')).toBe(false);
  });

  it('should add a favorite', () => {
    const addFavorite = vi.fn();
    vi.mocked(useFavoritesStore).mockReturnValue({
      favorites: [],
      addFavorite,
      removeFavorite: vi.fn(),
    });

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockFavorite);
    });

    expect(addFavorite).toHaveBeenCalledWith(mockFavorite);
  });

  it('should remove a favorite', () => {
    const removeFavorite = vi.fn();
    vi.mocked(useFavoritesStore).mockReturnValue({
      favorites: [mockFavorite],
      addFavorite: vi.fn(),
      removeFavorite,
    });

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.removeFavorite('1');
    });

    expect(removeFavorite).toHaveBeenCalledWith('1');
  });
});