import { Box, Stack, HStack, Heading } from '@chakra-ui/react';
import { Skeleton } from '@/components/ui/skeleton';

export const AlertSkeleton = () => {
  return (
    <Box>
      <Heading size="md" mb={4}>Weather Alerts</Heading>
      <Box bg="gray.900" p={4} borderRadius="lg">
        <Stack gap={4}>
          <HStack gap={3}>
            <Box bg="gray.700" borderRadius="full" w="5" h="5" />
            <Skeleton height="20px" width="200px" />
          </HStack>

          <Stack gap={2}>
            <Skeleton height="20px" width="full" />
            <Skeleton height="20px" width="full" />
            <Skeleton height="20px" width="90%" />
          </Stack>

          <Stack gap={2}>
            <Skeleton height="16px" width="240px" />
            <Skeleton height="16px" width="300px" />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};