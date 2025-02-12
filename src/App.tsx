// App.tsx
import { Grid, Container, Button, VStack, Stack } from '@chakra-ui/react';
import { useWeather } from './hooks/useWeather';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { FavoritesList } from './components/FavoritesList';
import { AlertsList } from './components/AlertList';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { useFavorites } from './hooks/useFavorites';
import { useCoordinatesStore } from './stores/coordinatesStore';
import { Toaster, toaster } from "@/components/ui/toaster"
import { AlertSkeleton } from './components/AlertListSkeleton';

function App() {
  const { lat, lon, setCoordinates, resetCoordinates } = useCoordinatesStore();
  const { data, isLoading } = useWeather();
  const { addFavorite, isFavorite } = useFavorites();

  const handleSearch = (lat: number, lon: number) => {
    setCoordinates(lat, lon);
  };

  const handleReset = () => {
    resetCoordinates();
  };

  const handleAddFavorite = () => {
    if (lat && lon && data) {
      try {
        addFavorite({
          id: `${lat}-${lon}`,
          name: data.current.name,
          lat,
          lon
        });
        toaster.create({
          title: 'Location added to favorites',
          type: 'success',
        });
      } catch (error) {
        toaster.create({
          title: 'Failed to add location',
          type: 'error',
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Toaster />
      <Grid templateColumns={{ base: '1fr', md: '3fr 2fr' }} gap={8}>
        <div>
          <SearchBar onSearch={handleSearch} onReset={handleReset} />
          {isLoading && <WeatherSkeleton />}
          {data && (
            <VStack gap={6} align="stretch">
              <WeatherCard data={data} />
              <Button
                onClick={handleAddFavorite}
                colorScheme="blue"
                alignSelf="flex-start"
                hidden={isFavorite(`${lat}-${lon}`)}
              >
                Add to Favorites
              </Button>
            </VStack>
          )}
        </div>
        <Stack gap={8}>
          <FavoritesList onSelect={handleSearch} />
          {isLoading ? <AlertSkeleton /> : <AlertsList alerts={data?.alerts} />}
        </Stack>
      </Grid>
    </Container>
  );
}

export default App;

