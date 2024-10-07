'use client';

import { Button } from '@/components/ui/button';

import {
  ExitIcon,
  ArchiveIcon,
  FilePlusIcon,
  DashboardIcon,
  FileMinusIcon,
  RulerSquareIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMutation } from 'react-query';
import { logout } from '@/services/auth.service';

const items = [
  {
    name: 'Dashboard',
    Icon: DashboardIcon,
    href: '/',
  },
  {
    name: 'Units',
    Icon: RulerSquareIcon,
    href: '/units',
  },
  {
    name: 'Products',
    Icon: ArchiveIcon,
    href: '/products',
  },
  {
    name: 'Sales',
    Icon: FilePlusIcon,
    href: '/sales',
  },
  {
    name: 'Returns',
    Icon: FileMinusIcon,
    href: '/returns',
  },
];

export default function Sidebar() {
  const pathname = window.location.pathname;

  const { isLoading, mutate, data } = useMutation(logout, {
    onSuccess: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
    onError: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
  });

  return (
    <div className="min-h-lvh max-w-72 border-r px-3 py-10" suppressHydrationWarning>
      {items.map(({ name, Icon, href }) => {
        const className = href === pathname ? 'bg-accent' : '';

        return (
          <Button
            key={name}
            asChild
            variant="ghost"
            className={cn('mb-1.5 min-w-full justify-start py-2', className)}
          >
            <Link href={href}>
              <Icon className="mr-2 h-4 w-4" /> {name}
            </Link>
          </Button>
        );
      })}

      <Button
        variant="ghost"
        className="mb-1.5 min-w-full justify-start py-2"
        onClick={mutate}
        disabled={isLoading || data}
      >
        {(isLoading || data) && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        <ExitIcon className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </div>
  );
}
