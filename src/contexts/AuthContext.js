import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Thiết lập API URL cố định - không sử dụng biến môi trường để tránh lỗi
const API_URL = 'https://intuitive-surprise-production.up.railway.app/api';

// Tạo context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm login
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Đang gửi request đăng nhập với data:', credentials);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response từ server:', response.data);
      
      if (response.data.token) {
        console.log('Token nhận được từ server:', response.data.token);
        localStorage.setItem('accessToken', response.data.token);
        
        // Lưu thông tin user vào localStorage
        if (response.data.user) {
          console.log('Lưu thông tin user vào localStorage:', response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          // Đặt user vào state
          setUser(response.data.user);
          setIsLoading(false);
          return true;
        }
        
        // Nếu có token nhưng không có user, gọi API lấy thông tin user
        await fetchUserProfile();
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      setIsLoading(false);
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  // Lấy thông tin người dùng
  const fetchUserProfile = async () => {
    console.log('Đang gọi fetchUserProfile...');
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('Không tìm thấy token trong localStorage');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    console.log('Token từ localStorage:', token);
    
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Phản hồi từ verify API:', response.data);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Cập nhật localStorage với thông tin user mới nhất 
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Xác thực thành công, user:', response.data.user);
      } else {
        console.warn('Không tìm thấy thông tin user trong phản hồi');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi khi xác thực token:', error);
      console.error('Chi tiết lỗi:', error.response || 'Không có phản hồi');
      setIsAuthenticated(false);
      setUser(null);
      // Xóa token không hợp lệ
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra người dùng có phải admin không
  const isAdmin = () => {
    // Kiểm tra user từ context
    if (user && user.role === 'admin') {
      return true;
    }
    
    // Nếu không có user trong context, thử kiểm tra từ localStorage
    try {
      const localUser = JSON.parse(localStorage.getItem('user'));
      return localUser && localUser.role === 'admin';
    } catch (e) {
      return false;
    }
  };

  // Kiểm tra token khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAdmin,
    fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 