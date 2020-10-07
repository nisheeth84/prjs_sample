import axios from 'axios';
import { apiUrl } from '../constants/api';
import {
  onRequestSuccess,
} from "./interceptor";

/**
 * Create basic config axios
 */
export const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.request.use(onRequestSuccess);
