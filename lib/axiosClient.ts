import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "https://later-cellular-input-schema.trycloudflare.com", 
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); 
  }
);

export default axiosClient;
