import api from '../utils/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  category: string;
  tags: string[];
  views: number;
  likes_count: number;
  comments_count: number;
  is_pinned: number;
  created_at: string;
  updated_at: string;
  username: string;
  avatar: string;
  author_bio?: string;
}

export interface CreatePostParams {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export const postService = {
  async getList(params: { page?: number; limit?: number; category?: string; search?: string } = {}) {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/posts/${id}`);
    return response.data.post;
  },

  async create(data: CreatePostParams) {
    const response = await api.post('/posts', data);
    return response.data.post;
  },

  async like(id: number) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  async favorite(id: number) {
    const response = await api.post(`/posts/${id}/favorite`);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
};