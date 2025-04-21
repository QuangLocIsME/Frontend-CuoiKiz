import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm login
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true
      });
      
      if (response.data.token) {
        console.log('Token nhận được từ server:', response.data.token);
        localStorage.setItem('accessToken', response.data.token);
        fetchUserProfile();
        return true;
      }
      
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
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Attempting to fetch user profile, accessToken exists:', !!token);
      
      // Kiểm tra local storage
      const localUser = localStorage.getItem('user');
      if (localUser) {
        console.log('User from localStorage:', JSON.parse(localUser));
      }

      // Verify token từ API
      const response = await axios.get(`${API_URL}/auth/verify`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Verify token response:', response.data);

      if (response.data.success) {
        console.log('Setting user from API:', response.data.user);
        setUser(response.data.user);
        
        // Cập nhật lại user trong localStorage để đảm bảo nhất quán
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('accessToken');
      console.error('Lỗi khi lấy thông tin người dùng:', err);
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