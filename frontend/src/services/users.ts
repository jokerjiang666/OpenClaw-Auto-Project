import api from '../utils/api';

export const userService = {
  async getById(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async getPosts(id: number, params: { page?: number; limit?: number } = {}) {
    const response = await api.get(`/users/${id}/posts`, { params });
    return response.data.posts;
  },

  async update(id: number, data: { avatar?: string; bio?: string }) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }
};