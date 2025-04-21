import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ChakraProvider, Box } from "@chakra-ui/react";
import { useEffect } from 'react';

import LoginPage from "./pages/authen/login";
import RegisterPage from "./pages/authen/register";

import Dashboard from "./pages/users/Dashboard";
import HomePage from "./pages/users/HomePage";
import Products from "./pages/box/Products";
import Detail from "./pages/box/Detail";

import theme from './theme';
import { setupAxiosInterceptors } from './utils/authUtils';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './hoc/AdminRoute';
import ProtectedRoute from './hoc/ProtectedRoute';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import BoxManagement from './pages/admin/BoxManagement';
import AdminManagement from './pages/admin/AdminManagement';
import BoxTypeChanceManagement from './pages/admin/BoxTypeChanceManagement';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('Đã thiết lập axios interceptors cho refresh token');
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box className="app-container">
            <Routes>
              {/* Các trang công khai */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              

              {/* Các route yêu cầu xác thực */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/unauthorized" element={<UnauthorizedPage />} />
                      <Route path="/box" element={<Products />} />
                      <Route path="/box/:id" element={<Detail />} />
                      {/* Nhóm các route Admin */}
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <Routes>
                              <Route path="" element={<AdminDashboard />} />
                              <Route path="management" element={<AdminManagement />} />
                              <Route path="users" element={<UserManagement />} />
                              <Route path="boxes" element={<BoxManagement />} />
                              <Route path="box-type-chance-management" element={<BoxTypeChanceManagement />} />
                            </Routes>
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </ProtectedRoute>
                }
              />

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

export default App;
