import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SearchBar } from '../SearchBar';
import { render } from '@/test/render';
import { toaster } from '@/components/ui/toaster';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();
  const originalError = console.error;

  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    expect(screen.getByText('Location Coordinates')).toBeInTheDocument();
    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('handles valid coordinate submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    await user.type(screen.getByLabelText(/latitude/i), '51.5074');
    await user.type(screen.getByLabelText(/longitude/i), '-0.1278');
    await user.click(screen.getByRole('button', { name: /get weather/i }));

    expect(mockOnSearch).toHaveBeenCalledWith(51.5074, -0.1278);
    expect(toaster.create).not.toHaveBeenCalled();
  });

  it('validates invalid number inputs', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    await user.clear(screen.getByLabelText(/latitude/i));
    await user.clear(screen.getByLabelText(/longitude/i));
    await user.type(screen.getByLabelText(/latitude/i), 'abc');
    await user.type(screen.getByLabelText(/longitude/i), 'def');
    await user.click(screen.getByRole('button', { name: /get weather/i }));

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Invalid coordinates',
      description: 'Please enter valid numbers for latitude and longitude',
      type: 'error',
    });
  });

  it('validates latitude range', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    await user.clear(screen.getByLabelText(/latitude/i));
    await user.clear(screen.getByLabelText(/longitude/i));
    await user.type(screen.getByLabelText(/latitude/i), '91');
    await user.type(screen.getByLabelText(/longitude/i), '0');
    await user.click(screen.getByRole('button', { name: /get weather/i }));

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Invalid latitude',
      description: 'Latitude must be between -90° and 90°',
      type: 'warning',
    });
  });

  it('validates longitude range', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    await user.clear(screen.getByLabelText(/latitude/i));
    await user.clear(screen.getByLabelText(/longitude/i));
    await user.type(screen.getByLabelText(/latitude/i), '0');
    await user.type(screen.getByLabelText(/longitude/i), '181');
    await user.click(screen.getByRole('button', { name: /get weather/i }));

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Invalid longitude',
      description: 'Longitude must be between -180° and 180°',
      type: 'warning',
    });
  });

  it('handles error in onSearch callback', async () => {
    const user = userEvent.setup();
    const mockOnSearchWithError = vi.fn().mockImplementation(() => {
      throw new Error('Search failed');
    });

    render(<SearchBar onSearch={mockOnSearchWithError} onReset={mockOnReset} />);

    await user.clear(screen.getByLabelText(/latitude/i));
    await user.clear(screen.getByLabelText(/longitude/i));
    await user.type(screen.getByLabelText(/latitude/i), '51.5074');
    await user.type(screen.getByLabelText(/longitude/i), '-0.1278');
    await user.click(screen.getByRole('button', { name: /get weather/i }));

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to process coordinates',
      type: 'error',
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('handles reset button click correctly', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const latitudeInput = screen.getByLabelText(/latitude/i);
    const longitudeInput = screen.getByLabelText(/longitude/i);

    await user.clear(latitudeInput);
    await user.clear(longitudeInput);
    await user.type(latitudeInput, '51.5074');
    await user.type(longitudeInput, '-0.1278');

    rerender(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    expect(latitudeInput).toHaveValue(51.5074);
    expect(longitudeInput).toHaveValue(-0.1278);

    await user.click(screen.getByRole('button', { name: /reset/i }));

    rerender(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    expect(latitudeInput).toHaveValue(null);
    expect(longitudeInput).toHaveValue(null);
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});