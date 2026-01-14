import React, { ReactNode } from "react";
import ClientLayout from "./../components/ClientLayout";
import ToastProvider from "./../components/ui/ToastProvider";
import ErrorBoundary from "./../components/ErrorBoundary";
import "./globals.css";

// Force dynamic rendering for all pages to avoid wallet SSR issues
export const dynamic = 'force-dynamic';

interface AppContainerProps {
  children: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="app-container">
      <div className="app-wrapper">{children}</div>
    </div>
  );
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <div id="root" className="main-container">
            <ClientLayout>
              {children}
            </ClientLayout>
          </div>
          <ToastProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
