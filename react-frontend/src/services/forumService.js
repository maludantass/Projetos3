import axios from 'axios';

const API = 'http://localhost:8080/api/forum'; // ← PORTA CERTA!

export const getCommunities = async () => {
  const res = await axios.get(`${API}/communities`);
  return res.data.content;
};
