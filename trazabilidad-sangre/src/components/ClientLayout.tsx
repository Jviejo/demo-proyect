'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PublicHeader from './layout/PublicHeader';
import AppHeader from './layout/AppHeader';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { Wallet } from './ConnectWalletButton';

interface ClientLayoutProps {
  children: ReactNode;
}

// Define app routes that should use AppHeader
const appRoutes = [
  '/all-role-grid',
  '/marketplace',
  '/extraction',
  '/role-donor',
  '/role-collector-center',
  '/role-laboratory',
  '/role-traders',
];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Determine which header to use based on current route
  const isAppRoute = appRoutes.some(route => pathname?.startsWith(route));
  const HeaderComponent = isAppRoute ? AppHeader : PublicHeader;

  return (
    <Wallet>
      <HeaderComponent />
      <main>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </Wallet>
  );
}
