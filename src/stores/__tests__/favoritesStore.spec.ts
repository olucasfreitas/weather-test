import { act } from '@testing-library/react';
import { useFavoritesStore } from '../favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    act(() => {
      useFavoritesStore.setState({ favorites: [] });
    });
  });

  it('adds favorite location correctly', () => {
    const newLocation = {
      id: 'test-id',
      name: 'Test Location',
      lat: 51.5074,
      lon: -0.1278
    };

    act(() => {
      useFavoritesStore.getState().addFavorite(newLocation);
    });

    const state = useFavoritesStore.getState();
    expect(state.favorites).toHaveLength(1);
    expect(state.favorites[0]).toEqual(newLocation);
  });

  it('removes favorite location correctly', () => {
    const location = {
      id: 'test-id',
      name: 'Test Location',
      lat: 51.5074,
      lon: -0.1278
    };

    act(() => {
      useFavoritesStore.getState().addFavorite(location);
      useFavoritesStore.getState().removeFavorite('test-id');
    });

    const state = useFavoritesStore.getState();
    expect(state.favorites).toHaveLength(0);
  });
});
