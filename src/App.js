import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ChakraProvider, Box, Spinner, Center } from "@chakra-ui/react";
import { useEffect } from 'react';
import Header from "./components/Header";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Dashboard from "./pages/Dashboard";
import theme from './theme';
import { setupAxiosInterceptors } from './utils/authUtils';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './hoc/AdminRoute';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import BoxManagement from './pages/admin/BoxManagement';

// Custom LoadingSpinner component
const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner 
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
);

// Trang Unauthorized khi không có quyền truy cập
const UnauthorizedPage = () => (
  <Center h="100vh" flexDirection="column">
    <Box fontSize="2xl" fontWeight="bold" mb={4}>403 - Không có quyền truy cập</Box>
    <Box>Bạn không có quyền truy cập vào trang này.</Box>
  </Center>
);

function App() {
  // Thiết lập interceptor cho axios khi ứng dụng khởi động
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('Đã thiết lập axios interceptors cho refresh token');
  }, []);

  // Thông tin người dùng mẫu cho Header (sẽ được thay thế bởi dữ liệu thực từ withAuth)
  const dummyUser = {
    username: 'Web3User',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/65232217-c113-40ce-aaa9-50b06a6ee8fa-profile_image-300x300.png',
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box className="app-container">
            <Routes>
              {/* Các trang công khai */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Trang người dùng đã đăng nhập */}
              <Route path="/dashboard" element={
                <>
                  <Header user={dummyUser} />
                  <Dashboard />
                </>
              } />
              
              {/* Trang không có quyền truy cập */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Các trang Admin */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              
              <Route path="/admin/boxes" element={
                <AdminRoute>
                  <BoxManagement />
                </AdminRoute>
              } />
              
              {/* Mặc định chuyển hướng */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

// Đặt LoadingSpinner ở đây để dễ dàng sử dụng lại trong các components khác
export { LoadingSpinner };
export default App;
