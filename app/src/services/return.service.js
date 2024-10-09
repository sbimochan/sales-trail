import axios from '@/lib/axios';

export async function getReturns({ page, limit, query }) {
  const data = await axios.get('/refunds', { params: { page, limit, q: query } });

  return data;
}

export async function getReturn({ id }) {
  const data = await axios.get(`/refunds/${id}`);

  return data;
}

export async function deleteReturn({ id }) {
  const data = await axios.delete(`/refunds/${id}`);

  return data;
}

export async function createReturn({ description, items = [], discount = 0, date }) {
  const data = await axios.post('/refunds', { description, items, discount, date });

  return data;
}

export async function updateReturn({ description, items = [], discount = 0, date, id }) {
  const data = await axios.put(`/refunds/${id}`, { description, items, discount, date });

  return data;
}
