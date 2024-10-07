import axios from '@/lib/axios';

export async function login({ email, password }) {
  const data = await axios.post('/login', { email, password });
  return data;
}

export async function logout() {
  const data = await axios.post('/logout');
  return data;
}

export async function getAuthenticatedUser() {
  const data = await axios.get('/user');
  return data;
}
