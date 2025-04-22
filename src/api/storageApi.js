import axios from 'axios';

const API_URL = 'http://localhost:5000/api/storage'; // Đường dẫn API cho storage

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

// API liên quan đến storage
const storageApi = {
  // Lấy danh sách vật phẩm của người dùng
  getUserRewards: async (username) => {
    try {
      const response = await api.get(`/${username}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vật phẩm của người dùng:', error);
      throw error.response?.data || { message: 'Lỗi không xác định' };
    }
  },
};

export default storageApi;