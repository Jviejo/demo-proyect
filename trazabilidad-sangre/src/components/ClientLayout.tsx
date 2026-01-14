'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      <main>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
