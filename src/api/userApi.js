import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo một instance riêng của axios để xử lý việc thêm token vào header
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Thêm interceptor để đính kèm access token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API liên quan đến người dùng
const userApi = {
  // Lấy tất cả người dùng (chỉ admin)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng', error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin người dùng có ID ${userId}`, error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng (admin)
  updateUserByAdmin: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật người dùng có ID ${userId}`, error);
      throw error;
    }
  },

  // Đặt lại mật khẩu người dùng (admin)
  resetPassword: async (userId, newPassword) => {
    try {
      const response = await api.put(`/users/${userId}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi đặt lại mật khẩu cho người dùng có ID ${userId}`, error);
      throw error;
    }
  },

  // Chuyển đổi trạng thái hoạt động của người dùng (kích hoạt/vô hiệu hóa)
  toggleUserStatus: async (userId) => {
    try {
      const response = await api.patch(`/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi chuyển đổi trạng thái người dùng có ID ${userId}`, error);
      throw error;
    }
  },

  // Nạp tiền/xu vào tài khoản người dùng (admin)
  addBalance: async (userId, amount, type) => {
    try {
      const response = await api.post(`/users/${userId}/add-balance`, { amount, type });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi nạp tiền/xu cho người dùng có ID ${userId}`, error);
      throw error;
    }
  },

  // Xóa người dùng (admin)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa người dùng có ID ${userId}`, error);
      throw error;
    }
  }
};

export default userApi; 