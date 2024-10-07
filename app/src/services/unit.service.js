import axios from '@/lib/axios';

export async function getUnits({ page, limit, query }) {
  const data = await axios.get('/units', { params: { page, limit, q: query } });

  return data;
}
