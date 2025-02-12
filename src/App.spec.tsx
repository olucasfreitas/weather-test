import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { render } from '@/test/render';
import { useWeather } from './hooks/useWeather';
import { useFavorites } from './hooks/useFavorites';
import { useCoordinatesStore } from './stores/coordinatesStore';
import { toaster } from '@/components/ui/toaster';

// Mock the custom hooks
vi.mock('./hooks/useWeather');
vi.mock('./hooks/useFavorites');
vi.mock('./stores/coordinatesStore');
vi.mock('@/components/ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
  Toaster: () => null
}));

const mockWeatherData = {
  current: {
    dt: 1645484400,
    temp: 20,
    humidity: 65,
    wind_speed: 5.5,
    weather: [{ description: 'clear sky' }],
    name: 'Test City'
  },
  timezone: 'UTC',
  forecast: {
    list: [
      {
        dt_txt: '2024-02-11 12:00:00',
        main: { temp: 22 },
        weather: [{ description: 'scattered clouds' }]
      }
    ]
  },
  alerts: [
    {
      sender_name: 'Test Authority',
      event: 'Test Alert',
      start: 1645484400,
      end: 1645570800,
      description: 'Test alert description'
    }
  ]
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCoordinatesStore).mockReturnValue({
      lat: 40,
      lon: -74,
      setCoordinates: vi.fn(),
      resetCoordinates: vi.fn()
    });
    vi.mocked(useWeather).mockReturnValue({
      data: mockWeatherData,
      dataUpdatedAt: 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: 'idle',
      isError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      isPending: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      promise: Promise.resolve(mockWeatherData)
    });

    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false)
    });
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Test City')).toBeInTheDocument();
  });

  it('shows loading state when weather data is loading', () => {
    vi.mocked(useWeather).mockReturnValue({
      data: undefined,
      dataUpdatedAt: 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: 'fetching',
      isError: false,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isInitialLoading: true,
      isLoading: true,
      isLoadingError: false,
      isPaused: false,
      isPending: true,
      isPlaceholderData: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      isSuccess: false,
      refetch: vi.fn(),
      status: 'pending',
      promise: Promise.resolve(mockWeatherData)
    });

    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText('Test City')).not.toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();
    const { setCoordinates } = useCoordinatesStore();
    render(<App />);

    const latInput = screen.getByLabelText(/latitude/i);
    const lonInput = screen.getByLabelText(/longitude/i);

    await user.type(latInput, '40.7128');
    await user.type(lonInput, '-74.0060');

    const searchButton = screen.getByRole('button', { name: /get weather/i });
    await user.click(searchButton);

    expect(setCoordinates).toHaveBeenCalledWith(40.7128, -74.006);
  });


  it('handles adding location to favorites', async () => {
    const user = userEvent.setup();
    const { addFavorite } = useFavorites();
    render(<App />);

    const addButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(addButton);

    expect(addFavorite).toHaveBeenCalledWith({
      id: '40--74',
      name: 'Test City',
      lat: 40,
      lon: -74
    });
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Location added to favorites',
      type: 'success'
    });
  });

  it('handles favorite addition error', async () => {
    const user = userEvent.setup();
    const { addFavorite } = useFavorites();
    vi.mocked(addFavorite).mockImplementation(() => {
      throw new Error('Failed to add favorite');
    });

    render(<App />);

    const addButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(addButton);

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Failed to add location',
      type: 'error'
    });
  });

  it('hides add to favorites button when location is already favorited', () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(true)
    });

    render(<App />);

    const addButton = screen.queryByRole('button', { name: /add to favorites/i });
    expect(addButton).not.toBeInTheDocument();
  });

  it('displays weather alerts when available', () => {
    render(<App />);

    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('Test alert description')).toBeInTheDocument();
  });

  it('handles reset location', async () => {
    const user = userEvent.setup();
    const { resetCoordinates } = useCoordinatesStore();
    render(<App />);

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(resetCoordinates).toHaveBeenCalled();
  });
});