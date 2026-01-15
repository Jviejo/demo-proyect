"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Logo from "../Logo";
import MobileMenu from "./MobileMenu";
import WalletInfo from "./WalletInfo";
import { AppContainer } from "@/app/layout";
import clsx from "clsx";

const appMenuItems = [
  { name: "Dashboard", path: "/all-role-grid" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Trazabilidad", path: "/trace" },
  { name: "Extracciones", path: "/extraction" },
];

const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white shadow-lg">
      <AppContainer>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Logo variant="white" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {appMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white shadow-md"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side - Wallet Info */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <WalletInfo variant="compact" />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </AppContainer>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={appMenuItems}
      />
    </header>
  );
};

export default AppHeader;
