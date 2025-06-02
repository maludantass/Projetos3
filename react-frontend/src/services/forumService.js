import axios from 'axios';

const API = 'http://localhost:8080/api/forum';

// Cabeçalho de autenticação (usado para endpoints protegidos)
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

// Buscar todas as comunidades do fórum
export const getCommunities = async () => {
  const res = await axios.get(`${API}/communities`);
  return res.data.content;
};

// Buscar posts de uma comunidade específica
export const getPostsByCommunity = async (communityId) => {
  const res = await axios.get(`${API}/posts/community/${communityId}`);
  return res.data.content;
};

// Criar post em uma comunidade
export const createPost = async (postData) => {
  const res = await axios.post(`${API}/posts`, postData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Buscar comentários de um post com paginação
export const getCommentsByPost = async (postId, page = 0, size = 10) => {
  const res = await axios.get(`${API}/posts/${postId}/comments`, {
    headers: getAuthHeader(),
    params: { page, size },
  });
  return res.data; // retorna o objeto completo com content, totalPages, etc
};

// Criar novo comentário
export const createComment = async (commentData) => {
  const res = await axios.post(`${API}/comments`, commentData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Enviar voto
export const vote = async (voteData) => {
  const res = await axios.post(`${API}/votes`, voteData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Thread de comentario
export const getRepliesForComment = async (parentCommentId) => {
  const res = await axios.get(`${API}/comments/${parentCommentId}/replies`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Atualizar post
export const updatePost = async (postId, data) => {
  const res = await axios.put(`${API}/posts/${postId}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Deletar post
export const deletePost = async (postId) => {
  const res = await axios.delete(`${API}/posts/${postId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Atualizar comentário
export const updateComment = async (commentId, data) => {
  const res = await axios.put(`${API}/comments/${commentId}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Deletar comentário
export const deleteComment = async (commentId) => {
  const res = await axios.delete(`${API}/comments/${commentId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
