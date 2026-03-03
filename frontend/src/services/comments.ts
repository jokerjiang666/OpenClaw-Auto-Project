import api from '../utils/api';

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  parent_id: number | null;
  content: string;
  likes_count: number;
  created_at: string;
  username: string;
  avatar: string;
  children: Comment[];
}

export interface CreateCommentParams {
  postId: number;
  content: string;
  parentId?: number;
}

export const commentService = {
  async getByPostId(postId: number) {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data.comments;
  },

  async create(data: CreateCommentParams) {
    const response = await api.post('/comments', {
      postId: data.postId,
      content: data.content,
      parentId: data.parentId || null
    });
    return response.data.comment;
  },

  async like(id: number) {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};