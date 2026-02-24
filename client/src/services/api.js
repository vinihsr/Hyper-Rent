import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  adapter: 'xhr',
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || "Erro inesperado no servidor";
    toast.error(message); 
    return Promise.reject(error);
  }
);

export default api;