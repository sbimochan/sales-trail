'use client';
import dynamic from 'next/dynamic';

import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import { useSearchParams, useRouter } from 'next/navigation';

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

import { cn } from '@/lib/utils';
import { PrinterIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getReturn } from '@/services/return.service';

function Print() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isQuotation, setQuotation] = useState(false);
  const [isDiscount, setIsDiscount] = useState(false);

  const { isLoading, data: auth } = useAuthUser();

  const returnId = searchParams.get('id');

  const { data, isFetching, isSuccess } = useQuery({
    enabled: true,
    queryKey: ['returns', returnId],
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: () => getReturn({ id: returnId }),
    onError: () => {
      router.replace('/404');
    },
  });

  if (isLoading || isFetching || !auth || !isSuccess) {
    return (
      <div className="flex h-lvh items-center justify-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-4 min-w-96" />
        </div>
      </div>
    );
  }

  const formatter = Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const placeholder = data.data.refund_items.length >= 20 ? 0 : 20 - data.data.refund_items.length;

  return (
    <>
      <div className="m-5 mx-auto flex w-[720px] justify-between print:hidden">
        <div className="flex">
          <div className="flex items-center space-x-2">
            <Switch
              id="quotation"
              checked={isQuotation}
              onCheckedChange={(value) => setQuotation(value)}
            />
            <Label htmlFor="quotation">Quotation</Label>
          </div>

          <div className="ml-5 flex items-center space-x-2">
            <Switch
              id="discount"
              checked={isDiscount}
              onCheckedChange={(value) => setIsDiscount(value)}
            />
            <Label htmlFor="quotation">Discount</Label>
          </div>
        </div>

        <Button onClick={window.print}>
          <PrinterIcon className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="container m-4 mx-auto w-[720px] p-5 screen:border screen:border-black">
        <div className="text-center">
          <h5 className="mb-0 text-black">Jay Bhole</h5>

          <div className="my-4 flex justify-between">
            <div className="w-full">
              <Textarea
                rows="1"
                className="text-md resize-none overflow-y-hidden rounded-none border-0 shadow-none focus-visible:ring-0"
              >
                {data.data.description || '#Cash'}
              </Textarea>
            </div>

            <p className="whitespace-nowrap">{format(new Date(data.data.date), 'yyyy-MM-dd')}</p>
          </div>

          <h5 className="text-md mb-1 font-bold text-black">
            {isQuotation ? 'Return' : 'Estimate'}
          </h5>

          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] border border-black text-black">S.N.</TableHead>
                <TableHead className="w-full border border-black text-left text-black">
                  Particulars
                </TableHead>
                <TableHead className="min-w-[60px] border border-black text-right text-black">
                  Qty
                </TableHead>
                <TableHead className="min-w-[60px] border border-black text-right text-black">
                  Unit
                </TableHead>
                <TableHead
                  className={cn(
                    'min-w-[70px] border border-black text-right text-black',
                    isQuotation ? 'hidden' : '',
                  )}
                >
                  Rate
                </TableHead>
                <TableHead
                  className={cn(
                    'min-w-[70px] border border-black text-right text-black',
                    isQuotation || !isDiscount ? 'hidden' : '',
                  )}
                >
                  Discount
                </TableHead>
                <TableHead
                  className={cn(
                    'min-w-[70px] border border-black text-right text-black',
                    isQuotation ? 'hidden' : '',
                  )}
                >
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border border-black">
              {data?.data?.refund_items?.map((refund, index) => (
                <TableRow key={index}>
                  <TableCell className="border-x border-y-0 border-x-black text-right">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-left font-medium">
                    {refund.item.name}
                  </TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-right">
                    {refund.quantity}
                  </TableCell>
                  <TableCell className="border-x border-y-0 border-x-black text-right">
                    {refund.item.unit.name}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  >
                    {formatter.format(refund.price)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation || !isDiscount ? 'hidden' : '',
                    )}
                  >
                    {formatter.format(refund.discount)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'border-x border-y-0 border-x-black text-right',
                      isQuotation ? 'hidden' : '',
                    )}
                  >
                    {formatter.format(refund.total)}
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
                      isQuotation || !isDiscount ? 'hidden' : '',
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
                  <TableCell
                    className="border border-black text-right"
                    colSpan={isDiscount ? 4 : 3}
                  >
                    Total
                  </TableCell>
                  <TableCell className="border border-black text-right">
                    {formatter.format(data.data.total)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="border border-black text-right"
                    colSpan={isDiscount ? 4 : 3}
                  >
                    Adj
                  </TableCell>
                  <TableCell className="border border-black text-right">
                    {formatter.format(data.data.discount)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="border border-black text-right font-medium"
                    colSpan={isDiscount ? 4 : 3}
                  >
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
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Print), { ssr: false });
