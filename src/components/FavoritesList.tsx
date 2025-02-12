import { VStack, Text, Button, HStack, Box, Heading } from '@chakra-ui/react';
import { useFavorites } from '../hooks/useFavorites';
import { toaster } from './ui/toaster';

interface FavoritesListProps {
  onSelect: (lat: number, lon: number) => void;
}

export const FavoritesList = ({ onSelect }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavorites();

  const handleRemove = (id: string) => {
    try {
      removeFavorite(id);
      toaster.create({
        title: `Removed from favorites`,
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: 'Failed to remove location',
        type: 'error',
      });
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Favorites</Heading>
      <VStack align="stretch" gap={4}>
        {favorites.length === 0 ? (
          <Text color="gray.500">No favorites yet</Text>
        ) : (
          favorites.map((fav) => (
            <HStack key={fav.id} p={3} borderWidth={1} borderRadius="md" justify="space-between">
              <Text fontWeight="medium">{fav.name}</Text>
              <HStack>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => onSelect(fav.lat, fav.lon)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemove(fav.id)}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
};
