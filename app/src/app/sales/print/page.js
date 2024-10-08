'use client';
import dynamic from 'next/dynamic';

import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';

import { useAuthUser } from '@/hooks/use-is-authenticated';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

import { getSale } from '@/services/sale.service';

function Item() {
  const searchParams = useSearchParams();

  const { isLoading, data: auth } = useAuthUser();

  const saleId = searchParams.get('id');

  const { data, isFetching, isSuccess } = useQuery({
    enabled: true,
    queryKey: ['sales', saleId],
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    queryFn: () => getSale({ id: saleId }),
  });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    window.print();
  }, [isSuccess]);

  if (isLoading || isFetching || !auth) {
    return (
      <div className="flex h-lvh items-center justify-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-4 min-w-96" />
        </div>
      </div>
    );
  }

  const formatter = Intl.NumberFormat('en', { minimumFractionDigits: 2 });
  const placeholder = data.data.sale_items.length >= 20 ? 0 : 20 - data.data.sale_items.length;

  return (
    <div className="container m-4 w-[720px] p-5">
      <div className="text-center">
        <h5 className="mb-5 text-sm text-black">Jay Bhole</h5>

        <Table className="border text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] border border-black text-black">S.N.</TableHead>
              <TableHead className="w-full border border-black text-left text-black">
                Particulars
              </TableHead>
              <TableHead className="w-[50px] border border-black text-right text-black">
                Qty
              </TableHead>
              <TableHead className="w-[50px] border border-black text-right text-black">
                Unit
              </TableHead>
              <TableHead className="w-[70px] border border-black text-right text-black">
                Rate
              </TableHead>
              <TableHead className="w-[70px] border border-black text-right text-black">
                Discount
              </TableHead>
              <TableHead className="w-[300px] border border-black text-right text-black">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.sale_items?.map((sale, index) => (
              <TableRow key={index}>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {index + 1}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-left font-medium">
                  {sale.item.name}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {sale.quantity}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {sale.item.unit.name}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {formatter.format(sale.price)}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {formatter.format(sale.discount)}
                </TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right">
                  {formatter.format(sale.total)}
                </TableCell>
              </TableRow>
            ))}

            {new Array(placeholder).fill(null).map(() => (
              <TableRow>
                <TableCell className="h-8 border-x border-y-0 border-x-black text-right"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-left font-medium"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="border border-black" rowSpan={3} colSpan={2}></TableCell>
              <TableCell className="border border-black text-right" colSpan={4}>
                Total
              </TableCell>
              <TableCell className="border border-black text-right">
                {formatter.format(data.data.total)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black text-right" colSpan={4}>
                Adj
              </TableCell>
              <TableCell className="border border-black text-right">
                {formatter.format(data.data.discount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black text-right font-medium" colSpan={4}>
                Grand Total
              </TableCell>
              <TableCell className="border border-black text-right font-medium">
                {formatter.format(data.data.grand_total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Item), { ssr: false });
