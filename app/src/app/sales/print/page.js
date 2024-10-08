'use client';
import dynamic from 'next/dynamic';

import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';

import { useAuthUser } from '@/hooks/use-is-authenticated';

import { Skeleton } from '@/components/ui/skeleton';

import { getSale } from '@/services/sale.service';

function Item() {
  const searchParams = useSearchParams();

  const { isLoading, data: auth } = useAuthUser();

  const saleId = searchParams.get('id');

  const { isFetching } = useQuery({
    enabled: true,
    queryKey: ['sales', saleId],
    keepPreviousData: true,
    queryFn: () => getSale({ id: saleId }),
  });

  if (isLoading || isFetching || !auth) {
    return (
      <div className="flex h-lvh items-center justify-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-4 min-w-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container m-4 w-[720px] border p-5">
      <div className="text-center">
        <h5 className="text-sm">Jay Bhole</h5>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Item), { ssr: false });
