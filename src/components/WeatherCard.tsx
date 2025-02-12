import { Box, Text, VStack, Heading, Flex } from '@chakra-ui/react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <Box p={6} borderWidth={1} borderRadius="lg" width="100%" boxShadow="md">
      <VStack align="stretch" gap={6}>
        <Heading size="md">
          {data.current.name}
        </Heading>

        <Flex justify="space-between">
          <Text fontSize="4xl" fontWeight="bold">
            {Math.round(data.current.temp)}°C
          </Text>
          <VStack align="end" gap={2}>
            <Text>Humidity: {data.current.humidity}%</Text>
            <Text>Wind: {data.current.wind_speed} m/s</Text>
            <Text textTransform="capitalize">
              {data.current.weather[0].description}
            </Text>
          </VStack>
        </Flex>

        <Box>
          <Heading size="md" mb={4}>5-Day Forecast</Heading>
          <VStack align="stretch" gap={2}>
            {data.forecast.list.slice(0, 5).map((item, index) => (
              <Flex
                key={index}
                p={2}
                borderWidth={1}
                borderRadius="md"
              >
                <Text flex="1" minW="100px">
                  {new Date(item.dt_txt).toLocaleDateString()}
                </Text>
                <Text w="100px" textAlign="center">
                  {Math.round(item.main.temp)}°C
                </Text>
                <Flex flex="1" justify="flex-end" gap={4}>
                  <Text textTransform="capitalize">
                    {item.weather[0].description}
                  </Text>
                  {item.rain && <Text>{item.rain['3h']}mm</Text>}
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};