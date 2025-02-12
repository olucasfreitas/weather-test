import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { WEATHER_BASE_URL, GEO_BASE_URL } from '../config/constants';
import { WeatherData } from '../types/weather';
import { useCoordinatesStore } from '../stores/coordinatesStore';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!apiKey) {
  throw new Error('OpenWeather API key is not configured');
}

const getLocationName = async (lat: number, lon: number): Promise<string> => {
  try {
    const geoResponse = await axios.get(`${GEO_BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: apiKey
      }
    });

    if (!geoResponse.data?.[0]) {
      return 'Unknown Location';
    }

    const location = geoResponse.data[0];
    const nameParts = [location.name, location.country].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(' - ') : 'Unknown Location';
  } catch (error) {
    console.warn('Failed to get location name:', error);
    return 'Unknown Location';
  }
};

export const useWeather = () => {
  const { lat, lon } = useCoordinatesStore();

  return useQuery<WeatherData, Error>({
    queryKey: ['weather', lat, lon],
    queryFn: async () => {
      try {
        if (!lat || !lon) throw new Error('Location not provided');

        const [locationName, weatherResponse] = await Promise.all([
          getLocationName(lat, lon),
          axios.get(`${WEATHER_BASE_URL}/onecall`, {
            params: {
              lat,
              lon,
              units: 'metric',
              appid: apiKey
            }
          })
        ]);

        return {
          current: {
            ...weatherResponse.data.current,
            name: locationName
          },
          timezone: weatherResponse.data.timezone,
          forecast: {
            list: weatherResponse.data.daily.map((day: any) => ({
              dt_txt: new Date(day.dt * 1000).toISOString(),
              main: {
                temp: day.temp.day
              },
              weather: [{
                description: day.weather[0].description
              }],
              rain: day.rain ? { '3h': day.rain } : undefined
            }))
          },
          alerts: weatherResponse.data.alerts,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          throw new Error(`Weather data fetch failed: ${message}`);
        }
        throw error;
      }
    },
    enabled: Boolean(lat && lon),
    retry: 0,
  });
};