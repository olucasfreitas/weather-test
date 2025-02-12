import { Box, Stack, HStack } from '@chakra-ui/react';
import { Skeleton } from '@/components/ui/skeleton';

export const WeatherSkeleton = () => {
  return (
    <Box p={6} borderRadius="lg" width="100%" bg="black">
      <Stack gap={6}>
        <Stack>
          <Skeleton height="24px" width="240px" />
          <HStack justify="space-between" align="flex-start">
            <Skeleton height="64px" width="160px" />
            <Stack align="flex-end" gap={3}>
              <Skeleton height="20px" width="220px" />
              <Skeleton height="20px" width="220px" />
              <Skeleton height="20px" width="220px" />
            </Stack>
          </HStack>
        </Stack>

        <Stack>
          <Skeleton height="24px" width="240px" />
          <Stack gap={2}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} p={3} bg="whiteAlpha.50" borderRadius="lg">
                <HStack justify="space-between">
                  <Skeleton height="20px" width="140px" />
                  <Skeleton height="20px" width="60px" />
                  <Skeleton height="20px" width="180px" />
                </HStack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};