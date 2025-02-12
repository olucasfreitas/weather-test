import { useState } from 'react';
import { Button, Input, Stack, Fieldset, HStack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';

interface SearchBarProps {
  onSearch: (lat: number, lon: number) => void;
  onReset: () => void;
}

export const SearchBar = ({ onSearch, onReset }: SearchBarProps) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      toaster.create({
        title: 'Invalid coordinates',
        description: 'Please enter valid numbers for latitude and longitude',
        type: 'error',
      });
      return;
    }

    if (lat < -90 || lat > 90) {
      toaster.create({
        title: 'Invalid latitude',
        description: 'Latitude must be between -90° and 90°',
        type: 'warning',
      });
      return;
    }

    if (lon < -180 || lon > 180) {
      toaster.create({
        title: 'Invalid longitude',
        description: 'Longitude must be between -180° and 180°',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      onSearch(lat, lon);
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to process coordinates',
        type: 'error',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLatitude('');
    setLongitude('');
    onReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Location Coordinates</Fieldset.Legend>
          <Fieldset.HelperText>
            Enter the latitude and longitude coordinates to get weather information.
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field
            label="Latitude"
            helperText="Enter a value between -90° (South) and 90° (North). Example: 51.5074 for London"
          >
            <Input
              name="latitude"
              type="number"
              step="any"
              placeholder="Enter latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Field>

          <Field
            label="Longitude"
            helperText="Enter a value between -180° (West) and 180° (East). Example: -0.1278 for London"
          >
            <Input
              name="longitude"
              type="number"
              step="any"
              placeholder="Enter longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Field>
        </Fieldset.Content>

        <HStack gap={4} mb={6}>
          <Button
            type="submit"
            loading={isLoading}
            loadingText="Searching"
            colorScheme="blue"
          >
            Get Weather
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="ghost"
          >
            Reset
          </Button>
        </HStack>
      </Fieldset.Root>
    </form>
  );
};