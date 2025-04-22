import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

// Tạo một instance riêng của axios để xử lý việc thêm token vào header
const api = axios.create({
  baseURL: `${API_URL}/rewards`, // Đường dẫn API cho phần thưởng
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

// API liên quan đến phần thưởng
const rewardApi = {
  // Lấy tất cả phần thưởng
  getAllRewards: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Lấy phần thưởng theo ID
  getRewardById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Tạo phần thưởng mới
  createReward: async (rewardData) => {
    const response = await api.post('/', rewardData);
    return response.data;
  },

  // Cập nhật phần thưởng
  updateReward: async (id, rewardData) => {
    const response = await api.put(`/${id}`, rewardData);
    return response.data;
  },

  // Xóa phần thưởng
  deleteReward: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default rewardApi;
