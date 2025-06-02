import axios from 'axios';

const API = 'http://localhost:8080/api/forum';

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

//criar posts
export const createPost = async (postData) => {
  const res = await axios.post(`${API}/posts`, postData);
  return res.data;
};
