'use client';
import { z } from 'zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

import dynamic from 'next/dynamic';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar } from '@/components/ui/calendar';
import Sidebar from '@/components/layout/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { PlusIcon, Trash2Icon } from 'lucide-react';
import { CalendarIcon, CheckIcon, CaretSortIcon, ReloadIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { useAuthUser } from '@/hooks/use-is-authenticated';

import { getItems } from '@/services/item.service';
import { useToast } from '@/hooks/use-toast';
import { createReturn } from '@/services/return.service';

const DEFAULT_ITEM = {
  item_id: 0,
  price: 0,
  quantity: 0,
  discount: 0,
};

const schema = z.object({
  discount: z.coerce.number(),
  description: z.string().min(0).nullable(),
  date: z.date({ required_error: 'A date of return is required.' }),
  items: z.array(
    z.object({
      item_id: z.coerce.number().gt(0),
      price: z.coerce.number().gt(0),
      quantity: z.coerce.number().gt(0),
      discount: z.coerce.number(),
    }),
  ),
});

function Return() {
  const router = useRouter();
  const { toast } = useToast();
  const formatter = Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const { isLoadingAuth, data: auth } = useAuthUser();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      discount: 0,
      description: '',
      items: [DEFAULT_ITEM],
    },
  });

  const { handleSubmit, control, setValue, watch } = form;

  const items = useFieldArray({ control, name: 'items', rules: { minLength: 1 } });

  const discount = watch('discount', 0);
  const watchedItems = useWatch({ control, name: 'items' });

  const { data: products, isFetching } = useQuery({
    queryKey: ['items'],
    enabled: true,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    queryFn: () => {
      return getItems({ page: 1, limit: 4096, query: '' });
    },
  });

  const { mutate, isLoading } = useMutation(createReturn, {
    onSuccess: () => {
      toast({ title: 'Return successfully created.' });
      router.push('/returns');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.response?.data?.message,
      });
    },
  });

  const total = watchedItems.reduce((acc, { quantity = 0, price = 0, discount = 0 }) => {
    return (acc += Number(quantity) * Number(price) - Number(discount));
  }, 0);

  if (isLoadingAuth || !auth || isFetching) {
    return (
      <div className="flex h-lvh items-center justify-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-4 min-w-96" />
        </div>
      </div>
    );
  }

  const onSelect = (index, product) => {
    setValue(`items[${index}].item_id`, product.id);
    setValue(`items[${index}].price`, product.price);
  };

  const onError = () => {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: 'Some fields in the form are invalid. Please check your entries and try again.',
    });
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-lvh w-full px-10 py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/returns">Returns</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Returns</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="my-4">
          <h1 className="text-2xl font-bold">Create Returns</h1>
        </div>

        <hr className="mb-5" />

        <Form {...form}>
          <form onSubmit={handleSubmit(mutate, onError)} className="max-w-[900px] space-y-8">
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-black">S.N.</TableHead>
                  <TableHead className="text-black">Particulars</TableHead>
                  <TableHead className="w-[100px] text-black">Rate</TableHead>
                  <TableHead className="w-[100px] text-black">Unit</TableHead>
                  <TableHead className="w-[100px] text-black">Qty</TableHead>
                  <TableHead className="w-[100px] text-black">Discount</TableHead>
                  <TableHead className="w-[100px] text-right text-black">Amount</TableHead>
                  <TableHead className="w-[100px] text-right text-black"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.fields.map((item, index) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="h-10">{index + 1}</TableCell>

                      <TableCell>
                        <FormField
                          control={control}
                          name={`items[${index}].item_id`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        'w-full justify-between border-none shadow-none focus:ring-0',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      {field.value
                                        ? products.data.data.find(({ id }) => id === field.value)
                                            ?.name
                                        : 'Select Item'}
                                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search item..." className="h-9" />
                                    <CommandList>
                                      <CommandEmpty>No framework found.</CommandEmpty>
                                      <CommandGroup>
                                        {products.data.data.map((product) => (
                                          <CommandItem
                                            value={product.name}
                                            key={product.id}
                                            onSelect={() => {
                                              onSelect(index, product);
                                            }}
                                          >
                                            {product.name}
                                            <CheckIcon
                                              className={cn(
                                                'ml-auto h-4 w-4',
                                                product.id === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0',
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          name={`items[${index}].price`}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  type="text"
                                  className="shadow-none"
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <Controller
                          control={control}
                          name={`items[${index}].item_id`}
                          render={({ field }) => {
                            const unit = products.data.data.find(
                              ({ id }) => id === field.value,
                            )?.unit;

                            return (
                              <Input
                                value={unit?.name || ''}
                                readOnly
                                className="border-none p-0 shadow-none focus:border-none focus-visible:ring-0"
                                type="text"
                              />
                            );
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          name={`items[${index}].quantity`}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  className="shadow-none"
                                  type="text"
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          name={`items[${index}].discount`}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  className="shadow-none"
                                  type="text"
                                  placeholder=""
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const isDiscountPercentage = String(value).endsWith('%');

                                    if (!isDiscountPercentage) {
                                      field.onChange(e);
                                      return;
                                    }

                                    const adj = (
                                      Number(Number(value.slice(0, -1)) / 100) * total
                                    ).toFixed(2);
                                    setTimeout(() => setValue(`items[${index}].discount`, adj), 0);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <Controller
                          control={control}
                          name={`items[${index}].price`}
                          render={({ field: { value: price } }) => (
                            <Controller
                              control={control}
                              name={`items[${index}].quantity`}
                              render={({ field: { value: quantity } }) => (
                                <Controller
                                  control={control}
                                  name={`items[${index}].discount`}
                                  render={({ field: { value: discount } }) => {
                                    let total = Number(price) * Number(quantity) - Number(discount);

                                    return (
                                      <Input
                                        value={isNaN(total) ? '0.00' : formatter.format(total || 0)}
                                        readOnly
                                        className="border-none p-0 text-right shadow-none focus:border-none focus-visible:ring-0"
                                        type="text"
                                      />
                                    );
                                  }}
                                />
                              )}
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          onClick={() => items.remove(index)}
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell className="h-11 text-right" colSpan={6}>
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">{formatter.format(total)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="h-11 text-right" colSpan={6}>
                    Adj
                  </TableCell>
                  <TableCell className="text-right">
                    <FormField
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              className="text-right shadow-none"
                              type="text"
                              placeholder=""
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                const isDiscountPercentage = String(value).endsWith('%');

                                if (!isDiscountPercentage) {
                                  field.onChange(e);
                                  return;
                                }

                                const adj = (
                                  Number(Number(value.slice(0, -1)) / 100) * total
                                ).toFixed(2);
                                setTimeout(() => setValue('discount', adj), 0);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="h-11 text-right" colSpan={6}>
                    Grand Total
                  </TableCell>
                  <TableCell className="text-right">{formatter.format(total - discount)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <Button
              type="button"
              onClick={() => items.append(DEFAULT_ITEM)}
              className="rounded-full"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </Button>

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea rows={5} placeholder="Notes" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Return), { ssr: false });
