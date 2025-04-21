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
    console.log('User not found in context, checking localStorage');
    // Kiểm tra trong localStorage
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (!localUser) {
      console.log('User not found in localStorage, redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    console.log('User found in localStorage:', localUser);
    if (localUser.role !== 'admin') {
      console.log('User from localStorage is not admin, redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
    
    console.log('User from localStorage is admin, allowing access');
    return children;
  }

  // Nếu người dùng đã đăng nhập nhưng không phải admin, chuyển hướng đến trang không có quyền
  const admin = isAdmin();
  console.log('User from context, isAdmin:', admin);
  if (!admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu là admin, hiển thị nội dung trang
  return children;
};

export default AdminRoute; 