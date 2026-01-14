import React, { ReactNode } from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ToastProvider from "./../components/ui/ToastProvider";
import ErrorBoundary from "./../components/ErrorBoundary";
import PageTransition from "./../components/PageTransition";
import "./globals.css";

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
            <Header />
            <main>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
          <ToastProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
