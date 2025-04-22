import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Link,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiHelpCircle } from 'react-icons/fi';

const Support = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} color={textColor} minH="100vh" py={10} px={6}>
      <VStack spacing={8} maxW="600px" mx="auto" textAlign="center">
        <Heading size="lg">Hỗ trợ khách hàng</Heading>
        <Text fontSize="md">
          Nếu bạn cần hỗ trợ hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua các kênh dưới đây.
        </Text>

        <VStack spacing={4} align="start" w="100%">
          <HStack spacing={4}>
            <Icon as={FiMail} boxSize={6} />
            <Text>
              Email: <Link href="mailto:support@example.com" color="blue.500">support@example.com</Link>
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Icon as={FiPhone} boxSize={6} />
            <Text>
              Điện thoại: <Link href="tel:+123456789" color="blue.500">+123 456 789</Link>
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Icon as={FiHelpCircle} boxSize={6} />
            <Text>
              Trung tâm trợ giúp: <Link href="/help-center" color="blue.500">/help-center</Link>
            </Text>
          </HStack>
        </VStack>

        <Button colorScheme="blue" size="lg" onClick={() => alert('Cảm ơn bạn đã liên hệ!')}>
          Gửi yêu cầu hỗ trợ
        </Button>
      </VStack>
    </Box>
  );
};

export default Support;