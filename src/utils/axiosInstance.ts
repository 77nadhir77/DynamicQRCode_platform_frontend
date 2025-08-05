const baseURL = import.meta.env.VITE_APP_BACKEND_URL;
import axios from 'axios';
const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const axiosInstance = () => {
  return instance;
};

export default axiosInstance;
