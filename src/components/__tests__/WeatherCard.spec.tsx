import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCard } from '../WeatherCard';
import { render } from '@/test/render';

describe('WeatherCard', () => {
  const mockWeatherDataWithRain = {
    current: {
      dt: 1645484400,
      temp: 20,
      humidity: 65,
      wind_speed: 5.5,
      weather: [{ description: 'rainy' }],
      name: 'London'
    },
    timezone: 'Europe/London',
    forecast: {
      list: [
        {
          dt_txt: '2024-02-11T12:00:00Z',
          main: { temp: 18 },
          weather: [{ description: 'light rain' }],
          rain: { '3h': 2.5 }
        },
        {
          dt_txt: '2024-02-12T12:00:00Z',
          main: { temp: 17 },
          weather: [{ description: 'moderate rain' }],
          rain: { '3h': 5.8 }
        }
      ]
    }
  };

  it('renders current weather information correctly', () => {
    render(<WeatherCard data={mockWeatherDataWithRain} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 5.5 m/s')).toBeInTheDocument();
    expect(screen.getByText('rainy')).toBeInTheDocument();
  });

  it('displays rain amount when present in forecast data', () => {
    render(<WeatherCard data={mockWeatherDataWithRain} />);

    expect(screen.getByText('2.5mm')).toBeInTheDocument();
    expect(screen.getByText('5.8mm')).toBeInTheDocument();
  });

  it('handles forecast items without rain data', () => {
    const mixedWeatherData = {
      ...mockWeatherDataWithRain,
      forecast: {
        list: [
          {
            dt_txt: '2024-02-11T12:00:00Z',
            main: { temp: 18 },
            weather: [{ description: 'light rain' }],
            rain: { '3h': 2.5 }
          },
          {
            dt_txt: '2024-02-12T12:00:00Z',
            main: { temp: 17 },
            weather: [{ description: 'clear sky' }],
            rain: undefined
          }
        ]
      }
    };

    render(<WeatherCard data={mixedWeatherData} />);

    expect(screen.getByText('2.5mm')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it('displays correct number of forecast items', () => {
    render(<WeatherCard data={mockWeatherDataWithRain} />);

    const forecastItems = screen.getAllByText(/°C/);
    // One for current temperature plus two forecast items
    expect(forecastItems).toHaveLength(3);
  });

  it('formats dates correctly in forecast', () => {
    render(<WeatherCard data={mockWeatherDataWithRain} />);

    const date1 = new Date('2024-02-11T12:00:00Z').toLocaleDateString();
    const date2 = new Date('2024-02-12T12:00:00Z').toLocaleDateString();

    expect(screen.getByText(date1)).toBeInTheDocument();
    expect(screen.getByText(date2)).toBeInTheDocument();
  });
});