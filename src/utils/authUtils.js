import axios from 'axios';

// Biến để theo dõi trạng thái đang làm mới token
let isRefreshing = false;
// Hàng đợi các yêu cầu đang chờ
let failedQueue = [];

// Xử lý các request trong hàng đợi
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Hàm làm mới token
export const refreshToken = async () => {
  try {
    const response = await axios.post(
      'https://intuitive-surprise-production.up.railway.app/api/auth/refresh',
      {},
      { withCredentials: true }
    );
    return response.data.success;
  } catch (error) {
    console.error('Lỗi khi làm mới token:', error);
    return false;
  }
};

// Thiết lập interceptor cho axios
export const setupAxiosInterceptors = () => {
  // Thiết lập request interceptor nếu cần
  
  // Thiết lập response interceptor để xử lý token hết hạn
  axios.interceptors.response.use(
    response => response, // Xử lý response thành công
    async error => {
      const originalRequest = error.config;
      
      // Kiểm tra lỗi 401 (Unauthorized) và chưa thử làm mới token
      if (
        error.response && 
        error.response.status === 401 && 
        error.response.data.tokenExpired && 
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          // Nếu đang làm mới token, thêm request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axios(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        
        // Đánh dấu đang làm mới token
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Gọi API làm mới token
          const refreshSuccess = await refreshToken();
          
          isRefreshing = false;
          
          if (refreshSuccess) {
            // Làm mới token thành công, tiếp tục các request đang chờ
            processQueue(null);
            // Thử lại request ban đầu
            return axios(originalRequest);
          } else {
            // Làm mới token thất bại, chuyển hướng đến trang đăng nhập
            processQueue(new Error('Làm mới token thất bại'));
            window.location.href = '/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          // Đăng xuất nếu không thể làm mới token
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Xử lý các lỗi khác
      return Promise.reject(error);
    }
  );
};

// Hàm đăng xuất
export const logout = async () => {
  try {
    await axios.post(
      'http://localhost:5000/api/auth/logout', 
      {},
      { withCredentials: true }
    );
    window.location.href = '/login';
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
  }
}; 
