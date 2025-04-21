import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

const AdminRoute = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Đang tải...</Text>
        </VStack>
      </Center>
    );
  }

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu người dùng đã đăng nhập nhưng không phải admin, chuyển hướng đến trang không có quyền
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu là admin, hiển thị nội dung trang
  return children;
};

export default AdminRoute; 