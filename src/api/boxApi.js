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

// API liên quan đến hộp quà
const boxApi = {
  // Lấy tất cả các hộp quà
  getAllBoxes: async () => {
    try {
      const response = await api.get('/boxes');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hộp quà', error);
      throw error;
    }
  },

  // Lấy thông tin một hộp quà theo ID
  getBoxById: async (boxId) => {
    try {
      const response = await api.get(`/boxes/${boxId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin hộp quà có ID ${boxId}`, error);
      throw error;
    }
  },
   // Lấy URL hình ảnh
   getImageUrl: (imageName) => {
    return `${API_URL.replace("/api", "")}${imageName}`;
  },


  // Tạo hộp quà mới (admin)
  createBox: async (boxData) => {
    try {
      const response = await api.post('/boxes', boxData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo hộp quà mới', error);
      throw error;
    }
  },

  // Cập nhật thông tin hộp quà (admin)
  updateBox: async (boxId, boxData) => {
    try {
      const response = await api.put(`/boxes/${boxId}`, boxData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật hộp quà có ID ${boxId}`, error);
      throw error;
    }
  },

  // Xóa hộp quà (admin)
  deleteBox: async (boxId) => {
    try {
      const response = await api.delete(`/boxes/${boxId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa hộp quà có ID ${boxId}`, error);
      throw error;
    }
  },

  // Bật/tắt trạng thái hoạt động của hộp quà (admin)
  toggleBoxStatus: async (boxId) => {
    try {
      const response = await api.patch(`/boxes/${boxId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi thay đổi trạng thái hộp quà có ID ${boxId}`, error);
      throw error;
    }
  },
  
  // Tải lên hình ảnh cho hộp quà
  uploadBoxImage: async (formData) => {
    try {
      const response = await api.post('/upload/boxes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải lên hình ảnh cho hộp quà', error);
      throw error;
    }
  }
};

export default boxApi; 