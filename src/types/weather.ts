export interface WeatherData {
  current: {
    dt: number;
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      description: string;
    }>;
    name: string;
  };
  timezone: string;
  forecast: {
    list: Array<{
      dt_txt: string;
      main: {
        temp: number;
      };
      weather: Array<{
        description: string;
      }>;
      rain?: {
        '3h': number;
      };
    }>;
  };
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags?: string[];
  }>;
  sys?: {
    country: string;
  };
}