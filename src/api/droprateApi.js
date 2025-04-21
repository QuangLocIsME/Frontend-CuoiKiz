import axios from 'axios';

const API_URL ='http://localhost:5000/api';

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

// API liên quan đến tỷ lệ rơi vật phẩm
const droprateApi = {
  // Lấy danh sách tất cả tỷ lệ rơi vật phẩm
  getAllDropRates: async () => {
    try {
      const response = await api.get('/box-type-chances');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỷ lệ rơi vật phẩm', error);
      throw error;
    }
  },

  // Lấy tỷ lệ rơi vật phẩm của một loại hộp
  getDropRateByBoxType: async (boxType) => {
    try {
      const response = await api.get(`/box-type-chances/${boxType}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy tỷ lệ rơi vật phẩm cho loại hộp ${boxType}`, error);
      throw error;
    }
  },

  // Tạo tỷ lệ rơi vật phẩm mới
  createDropRate: async (dropRateData) => {
    try {
      const response = await api.post('/box-type-chances', dropRateData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo tỷ lệ rơi vật phẩm mới', error);
      throw error;
    }
  },

  // Cập nhật tỷ lệ rơi vật phẩm
  updateDropRate: async (boxType, dropRateData) => {
    try {
      const response = await api.put(`/box-type-chances/${boxType}`, dropRateData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật tỷ lệ rơi vật phẩm cho loại hộp ${boxType}`, error);
      throw error;
    }
  },

  
};

export default droprateApi;