import { useQuery } from 'react-query';
import { getAuthenticatedUser } from '@/services/auth.service';

export const useAuthUser = () => {
  const query = useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: getAuthenticatedUser,
    onError: () => (window.location.href = '/login'),
  });

  return query;
};
