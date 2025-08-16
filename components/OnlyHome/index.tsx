'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface OnlyHomeProps {
  children: React.ReactNode;
}

export default function OnlyHome({ children }: OnlyHomeProps) {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <>{children}</>;
}
