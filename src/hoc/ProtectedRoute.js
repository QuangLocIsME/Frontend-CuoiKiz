import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Hiển thị spinner khi đang tải
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu không có user, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu đã đăng nhập, hiển thị Header và nội dung con
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProtectedRoute;