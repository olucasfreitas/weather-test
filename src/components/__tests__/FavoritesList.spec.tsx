import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { FavoritesList } from '../FavoritesList';
import { render } from '@/test/render';
import { useFavorites } from '../../hooks/useFavorites';
import { toaster } from '../ui/toaster';

vi.mock('../../hooks/useFavorites');
vi.mock('../ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
}));

describe('FavoritesList', () => {
  const mockOnSelect = vi.fn();
  const mockRemoveFavorite = vi.fn();
  const mockFavorites = [
    { id: '1', name: 'London', lat: 51.5074, lon: -0.1278 },
    { id: '2', name: 'Paris', lat: 48.8566, lon: 2.3522 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useFavorites as any).mockReturnValue({
      favorites: mockFavorites,
      removeFavorite: mockRemoveFavorite,
    });
  });

  it('renders the favorites list correctly', () => {
    render(<FavoritesList onSelect={mockOnSelect} />);

    expect(screen.getByRole('heading', { name: /favorites/i })).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });

    expect(viewButtons).toHaveLength(2);
    expect(removeButtons).toHaveLength(2);

    // Check button styling
    viewButtons.forEach(button => {
      expect(button).toHaveClass('chakra-button');
    });

    removeButtons.forEach(button => {
      expect(button).toHaveClass('chakra-button');
    });
  });

  it('displays "No favorites yet" message when favorites list is empty', () => {
    (useFavorites as any).mockReturnValue({
      favorites: [],
      removeFavorite: mockRemoveFavorite,
    });

    render(<FavoritesList onSelect={mockOnSelect} />);

    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
  });

  it('calls onSelect with correct coordinates when View button is clicked', () => {
    render(<FavoritesList onSelect={mockOnSelect} />);

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    viewButtons[0].click();

    expect(mockOnSelect).toHaveBeenCalledWith(51.5074, -0.1278);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('calls removeFavorite and shows success toast when Remove button is clicked', () => {
    render(<FavoritesList onSelect={mockOnSelect} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    removeButtons[0].click();

    expect(mockRemoveFavorite).toHaveBeenCalledWith('1');
    expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Removed from favorites',
      type: 'success',
    });
  });

  it('shows error toast when removeFavorite fails', () => {
    const error = new Error('Failed to remove');
    mockRemoveFavorite.mockImplementation(() => {
      throw error;
    });

    render(<FavoritesList onSelect={mockOnSelect} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    removeButtons[0].click();

    expect(mockRemoveFavorite).toHaveBeenCalledWith('1');
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Failed to remove location',
      type: 'error',
    });
  });

  it('correctly styles list items', () => {
    render(<FavoritesList onSelect={mockOnSelect} />);

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });

    viewButtons.forEach(button => {
      expect(button).toHaveClass('chakra-button');
    });

    removeButtons.forEach(button => {
      expect(button).toHaveClass('chakra-button');
    });
  });
});