import axios from '@/lib/axios';

export async function getUnits({ page, limit, query }) {
  const data = await axios.get('/units', { params: { page, limit, q: query } });

  return data;
}

export async function deleteUnit({ id }) {
  const data = await axios.delete(`/units/${id}`);

  return data;
}

export async function createUnit({ name }) {
  const data = await axios.post('/units', { name });

  return data;
}

export async function updateUnit({ name, id }) {
  const data = await axios.put(`/units/${id}`, { name, id });

  return data;
}
