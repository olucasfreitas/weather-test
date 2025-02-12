# Weather Test

This project is designed to test and display weather information. It fetches data from a weather API and presents it in a user-friendly format.

## Features

- Fetches current weather data
- Displays temperature, humidity, and weather conditions
- Government Alerts

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/weather-test.git
  ```
2. Navigate to the project directory:
  ```bash
  cd weather-test
  ```
3. Install the required dependencies:
  ```bash
  npm install
  ```

## Usage

1. Subscribe to the [OpenWeatherMap website](https://openweathermap.org/api/one-call-3) free plan to test this application.
2. Create a `.env` file in the root directory of the project and add your OpenWeather API key:
  ```plaintext
  VITE_OPENWEATHER_KEY=your_openweather_api_key
  ```
3. Run the application:
  ```bash
  npm run dev
  ```
4. Open your browser and navigate to `http://localhost:5173` to view the weather information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
