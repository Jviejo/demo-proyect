'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { Wallet } from './ConnectWalletButton';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Wallet>
      <Header />
      <main>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </Wallet>
  );
}
