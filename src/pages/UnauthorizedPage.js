import React from 'react';
import { Box, Center } from '@chakra-ui/react';
// Trang Unauthorized khi không có quyền truy cập
const UnauthorizedPage = () => (
    <Center h="100vh" flexDirection="column">
      <Box fontSize="2xl" fontWeight="bold" mb={4}>403 - Không có quyền truy cập</Box>
      <Box>Bạn không có quyền truy cập vào trang này.</Box>
    </Center>
  );
export default UnauthorizedPage;