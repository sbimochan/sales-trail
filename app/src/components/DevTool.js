import dynamic from 'next/dynamic';

const DevTool = dynamic(() => import('@hookform/devtools').then(({ DevTool }) => DevTool), {
  ssr: false,
});

export default DevTool;
