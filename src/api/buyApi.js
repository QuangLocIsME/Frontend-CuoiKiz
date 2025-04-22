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

// API liên quan đến mua vật phẩm

const buyApi = {
    // Mua vật phẩm
    buyItem: async (boxId, username, type) => {
        try {
        const response = await api.post('/buy', { boxId, username, type });
        return response.data;
        } catch (error) {
        console.error('Lỗi khi mua vật phẩm', error);
        throw error;
        }
    },
    };
export default buyApi;