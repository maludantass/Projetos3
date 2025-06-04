import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

// Obter o feed geral
export const getGeneralFeed = () => api.get('/feed/general');

// Obter o feed de um usuário
export const getUserFeed = (userId) => api.get(`/feed/${userId}`);

// Criar novo post
export const createPost = (userId, postData) =>
  api.post(`/feed/post?userId=${userId}`, postData);

// Obter posts curtidos por um usuário
export const getLikedPosts = (userId) => api.get(`/feed/liked/${userId}`);

export const toggleLike = (userId, postId) =>
  api.post(`/feed/like?userId=${userId}&postId=${postId}`);

export const toggleLikeAPI = (userId, postId) =>
  api.post(`/feed/like?userId=${userId}&postId=${postId}`);
