import { describe, test, vi, expect, beforeEach, Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useWeather } from '../useWeather'; // Adjust the import path as needed
import { useCoordinatesStore } from '@/stores/coordinatesStore';

// Mock environment variable
vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test_api_key');

// Mock modules
vi.mock('axios');
vi.mock('@/stores/coordinatesStore', () => ({
  useCoordinatesStore: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useWeather', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  test('does not fetch data when lat or lon is missing', () => {
    vi.mocked(useCoordinatesStore).mockReturnValue({ lat: null, lon: 12.34 });


    const { result } = renderHook(() => useWeather(), { wrapper });

    expect(result.current.isPending).toBe(true);
    expect(axios.get).not.toHaveBeenCalled();
  });


  test('handles reverse geocoding failure', async () => {
    vi.mocked(useCoordinatesStore).mockReturnValue({ lat: 1, lon: 2 });
    vi.spyOn(console, 'warn').mockImplementation(() => { });

    (axios.get as Mock)
      .mockRejectedValueOnce(new Error('API error'))
      .mockResolvedValueOnce({
        data: {
          current: {},
          daily: [],
          timezone: '',
          alerts: [],
        },
      });

    const { result } = renderHook(() => useWeather(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.current.name).toBe('Unknown Location');
    expect(console.warn).toHaveBeenCalled();
  });

  test('handles weather API error', async () => {
    vi.mocked(useCoordinatesStore).mockReturnValue({ lat: 1, lon: 2 });

    const error = new Error('Weather API failed');
    (axios.get as Mock)
      .mockResolvedValueOnce({ data: [{ name: 'Test' }] })
      .mockRejectedValueOnce(error);

    const { result } = renderHook(() => useWeather(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Weather API failed');
  });

  test('handles empty reverse geocoding response', async () => {
    vi.mocked(useCoordinatesStore).mockReturnValue({ lat: 1, lon: 2 });

    (axios.get as Mock)
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: {
          current: {},
          daily: [],
          timezone: '',
          alerts: [],
        },
      });

    const { result } = renderHook(() => useWeather(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.current.name).toBe('Unknown Location');
  });

  test('does not retry on failure', async () => {
    vi.mocked(useCoordinatesStore).mockReturnValue({ lat: 1, lon: 2 });

    (axios.get as Mock)
      .mockResolvedValueOnce({ data: [{ name: 'Test' }] })
      .mockRejectedValueOnce(new Error('Weather API failed'));

    const { result } = renderHook(() => useWeather(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

