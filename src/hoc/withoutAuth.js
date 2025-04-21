import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../App';

/**
 * HOC withoutAuth - Ngăn truy cập vào trang khi đã xác thực
 * (dùng cho trang login/register)
 * 
 * @param {React.ComponentType} Component - Component muốn bảo vệ
 * @param {string} redirectPath - Đường dẫn chuyển hướng nếu đã đăng nhập
 * @returns {React.ComponentType} - Component đã được bảo vệ
 */
const withoutAuth = (Component, redirectPath = '/dashboard') => {
  const UnauthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm kiểm tra token
    const checkAuth = async () => {
      try {
        // Thực hiện request đến endpoint xác thực
        const response = await axios.get('http://localhost:5000/api/auth/verify', {
          withCredentials: true // Quan trọng để gửi cookie
        });
        
        // Nếu token hợp lệ, đánh dấu là đã xác thực và chuyển hướng
        if (response.data.success) {
          setIsAuthenticated(true);
          navigate(redirectPath);
        } else {
          // Nếu không có token hoặc token không hợp lệ, cho phép truy cập trang login
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Nếu có lỗi, người dùng không được xác thực
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Chạy xác thực khi component mount
    useEffect(() => {
      checkAuth();
    }, []);

    // Nếu đang loading, hiển thị trạng thái loading
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Nếu không xác thực, hiển thị component
    if (!isAuthenticated) {
      return <Component {...props} />;
    }

    // Fallback - redirect sẽ được xử lý trong navigate
    return null;
  };

  return UnauthenticatedComponent;
};

export default withoutAuth; 