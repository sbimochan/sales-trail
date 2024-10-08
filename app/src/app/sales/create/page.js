'use client';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/sidebar';

function Sale() {
  return (
    <div className="flex">
      <Sidebar />
    </div>
  );
}

export default dynamic(() => Promise.resolve(Sale), { ssr: false });
