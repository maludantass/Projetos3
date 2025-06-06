import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do seu backend
});

// Cabeçalho de autenticação (opcional, se você usa token JWT)
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

// Obter o feed geral
export const getGeneralFeed = () =>
  api.get('/feed/general').then(res => res.data);


// Criar novo post
export const createPost = (userId, postData) =>
  api.post(`/feed/post?userId=${userId}`, postData, {
    headers: getAuthHeader()
  });

// Obter posts curtidos por um usuário
export const getLikedPosts = (userId) =>
  api.get(`/feed/liked/${userId}`, {
    headers: getAuthHeader()
  });

// Curtir ou descurtir um post
export const toggleLikeAPI = (userId, postId) =>
  api.post(`/feed/like?userId=${userId}&postId=${postId}`, {}, {
    headers: getAuthHeader()
  });

// Obter posts favoritados por um usuário
export const getFavoritedPosts = (userId) =>
  api.get(`/feed/saved/${userId}`, {
    headers: getAuthHeader()
  });

// Favoritar ou desfavoritar um post
export const toggleFavoriteAPI = (userId, postId) =>
  api.post(`/feed/save?userId=${userId}&postId=${postId}`, {}, {
    headers: getAuthHeader()
  });
export const addComment = (postId, userId, text) =>
  api.post('/feed/comment', {
    postId: postId.toString(),
    userId: userId.toString(),
    text
  });
