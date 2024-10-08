'use client';
import dynamic from 'next/dynamic';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { getSale } from '@/services/sale.service';
import { cn } from '@/lib/utils';
import { PrinterIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

function Item() {
  const searchParams = useSearchParams();

  const [isQuotation, setQuotation] = useState(false);
  const { isLoading, data: auth } = useAuthUser();

  const saleId = searchParams.get('id');

  const { data, isFetching } = useQuery({
    enabled: true,
    queryKey: ['sales', saleId],
    keepPreviousData: true,
    refetchOnWindowFocus: false,
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

  const formatter = Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const placeholder = data.data.sale_items.length >= 20 ? 0 : 20 - data.data.sale_items.length;

  return (
    <>
      <div className="m-5 mx-auto flex w-[720px] justify-between print:hidden">
        <div className="flex items-center space-x-2">
          <Switch
            id="quotation"
            checked={isQuotation}
            onCheckedChange={(value) => setQuotation(value)}
          />
          <Label htmlFor="quotation">Quotation</Label>
        </div>

        <Button onClick={window.print}>
          <PrinterIcon className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="container m-4 mx-auto w-[720px] p-5 screen:border screen:border-black">
        <div className="text-center">
          <h5 className="mb-5 text-sm text-black">Jay Bhole</h5>

          <div className="my-4 flex justify-between text-xs">
            <p className="underline"># Cash</p>
            <p>Date: {data.data.date}</p>
          </div>

          <h5 className="mb-5 text-sm font-bold text-black">
            {isQuotation ? 'Quotation' : 'Estimate'}
          </h5>

          <Table className="border text-[9px]">
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
                <TableHead
                  className={cn(
                    'w-[50px] border border-black text-right text-black',
                    isQuotation ? 'hidden' : '',
                  )}
                >
                  Rate
                </TableHead>
                <TableHead
                  className={cn(
                    'w-[50px] border border-black text-right text-black',
                    isQuotation ? 'hidden' : '',
                  )}
                >
                  Discount
                </TableHead>
                <TableHead
                  className={cn(
                    'w-[50px] border border-black text-right text-black',
                    isQuotation ? 'hidden' : '',
                  )}
                >
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border border-black">
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
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  >
                    {formatter.format(sale.price)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  >
                    {formatter.format((sale.discount / sale.total) * 100)} %
                  </TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  >
                    {formatter.format(sale.total)}
                  </TableCell>
                </TableRow>
              ))}

              {new Array(placeholder).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="h-8 border-x border-y-0 border-x-black text-right"></TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-left font-medium"></TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-right"></TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  ></TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  ></TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  ></TableCell>
                </TableRow>
              ))}
            </TableBody>

            {isQuotation ? (
              <TableFooter>
                <TableRow>
                  <TableCell className="border border-black text-left" colSpan={4}>
                    <div className="w-[50px] text-right">{data.data.id}</div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            ) : (
              <TableFooter>
                <TableRow>
                  <TableCell className="border border-black text-left" rowSpan={3} colSpan={2}>
                    <div className="w-[50px] rotate-[270deg] text-right">{data.data.id}</div>
                  </TableCell>
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
            )}
          </Table>
        </div>

        <Textarea
          className="rounded-none border-t-0 border-black text-[9px] focus-visible:ring-0"
          placeholder=""
        />
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Item), { ssr: false });
