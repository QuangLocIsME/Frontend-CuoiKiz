import React, { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, useColorModeValue, Button, useDisclosure } from '@chakra-ui/react';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user= JSON.parse(localStorage.getItem('user')) || null; // Assuming user data is stored in localStorage
  return (
    <Box p={5}>
      <Heading mb={5}>Bảng Điều Khiển</Heading>
      
      <Box 
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={useColorModeValue('white', 'gray.700')}
        shadow="md"
      >
        <Heading size="md" mb={4}>Thông tin cá nhân</Heading>
        
        <VStack align="stretch" spacing={3}>
          <HStack>
            <Text fontWeight="bold" minWidth="150px">ID:</Text>
            <Text color="gray.500">{user?.id}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minWidth="150px">Tên đăng nhập:</Text>
            <Text>{user?.username}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minWidth="150px">Email:</Text>
            <Text>{user?.email}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minWidth="150px">Họ và tên:</Text>
            <Text>{user?.fullname || 'Chưa cập nhật'}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minWidth="150px">Trạng thái:</Text>
            <Badge colorScheme="green">Đã xác thực</Badge>
          </HStack>
          
          <Box mt={4}>
            <Button 
              colorScheme="blue" 
              onClick={onOpen}
              size="md"
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </VStack>
      </Box>
      
      <Text mt={5} fontSize="sm" color="gray.500">
        Bạn đang xem trang được bảo vệ, chỉ người dùng đã đăng nhập mới có thể truy cập.
      </Text>
      
      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Dashboard; 