import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../App';

/**
 * HOC withAuth - Kiểm tra xác thực người dùng
 * 
 * @param {React.ComponentType} Component - Component muốn bảo vệ
 * @returns {React.ComponentType} - Component đã được bảo vệ
 */
const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    // Hàm xác thực token
    const verifyAuth = async () => {
      try {
        // Thực hiện request đến endpoint xác thực
        const response = await axios.get('https://intuitive-surprise-production.up.railway.app/api/auth/verify', {
          withCredentials: true // Quan trọng để gửi cookie
        });
        
        // Nếu thành công, cập nhật trạng thái
        if (response.data.success) {
          setIsAuthenticated(true);
          setUserData(response.data.user);
        } else {
          // Nếu không được xác thực, chuyển về login
          navigate('/login');
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        // Nếu có lỗi, cũng chuyển về login
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Chạy xác thực khi component mount
    useEffect(() => {
      verifyAuth();
    }, []);

    // Nếu đang loading, hiển thị trạng thái loading
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Nếu đã xác thực, render component với userData
    if (isAuthenticated) {
      return <Component {...props} user={userData} />;
    }

    // Fallback - redirect nên không cần return, nhưng để đảm bảo
    return null;
  };

  return AuthenticatedComponent;
};

export default withAuth; 
