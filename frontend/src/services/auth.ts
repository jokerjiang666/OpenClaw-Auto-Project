import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  email: string;
}

export const authService = {
  async register(data: RegisterParams) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      useAuthStore.getState().setAuth(response.data.user, response.data.token);
    }
    return response.data;
  },

  async login(data: LoginParams) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      useAuthStore.getState().setAuth(response.data.user, response.data.token);
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout() {
    useAuthStore.getState().logout();
  }
};