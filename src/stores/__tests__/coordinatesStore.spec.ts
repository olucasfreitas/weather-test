import { act } from '@testing-library/react';
import { useCoordinatesStore } from '../coordinatesStore';

describe('coordinatesStore', () => {
  beforeEach(() => {
    act(() => {
      useCoordinatesStore.setState({ lat: undefined, lon: undefined });
    });
  });

  it('sets coordinates correctly', () => {
    act(() => {
      useCoordinatesStore.getState().setCoordinates(51.5074, -0.1278);
    });

    const state = useCoordinatesStore.getState();
    expect(state.lat).toBe(51.5074);
    expect(state.lon).toBe(-0.1278);
  });

  it('resets coordinates correctly', () => {
    act(() => {
      useCoordinatesStore.getState().setCoordinates(51.5074, -0.1278);
      useCoordinatesStore.getState().resetCoordinates();
    });

    const state = useCoordinatesStore.getState();
    expect(state.lat).toBeUndefined();
    expect(state.lon).toBeUndefined();
  });
});
