import { Alert, Stack, Box, Heading } from '@chakra-ui/react';

interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags?: string[];
}

interface AlertsListProps {
  alerts?: WeatherAlert[];
}

export const AlertsList = ({ alerts }: AlertsListProps) => {
  if (!alerts?.length) {
    return (
      <Box>
        <Heading size="md" mb={4}>Weather Alerts</Heading>
        <Alert.Root
          status="neutral"
          role="alert"
          data-status="neutral"
        >
          <Alert.Indicator />
          <Alert.Title>No active weather alerts for this location</Alert.Title>
        </Alert.Root>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Weather Alerts</Heading>
      <Stack gap={4} width="full">
        {alerts.map((alert, index) => (
          <Alert.Root
            key={index}
            status="warning"
            role="alert"
            data-status="warning"
          >
            <Alert.Indicator />
            <Box>
              <Alert.Title>{alert.event}</Alert.Title>
              <Alert.Description>
                {alert.description}
                {alert.sender_name && (
                  <Box mt={2} fontSize="sm" color="gray.600">
                    Source: {alert.sender_name}
                  </Box>
                )}
                <Box fontSize="sm" color="gray.600">
                  Valid: {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
                </Box>
              </Alert.Description>
            </Box>
          </Alert.Root>
        ))}
      </Stack>
    </Box>
  );
};