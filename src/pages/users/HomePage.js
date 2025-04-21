import React from 'react';
import { Box, Center, Text } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Center h="100vh" flexDirection="column">
      <Box fontSize="4xl" fontWeight="bold" mb={4}>
        Chào mừng đến với Web3Game!
      </Box>
      <Text fontSize="lg">Khám phá các tính năng thú vị của chúng tôi.</Text>
    </Center>
  );
};

export default HomePage;