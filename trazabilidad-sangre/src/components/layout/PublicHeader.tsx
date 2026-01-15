"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Logo from "../Logo";
import MobileMenu from "./MobileMenu";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { AppContainer } from "@/app/layout";
import clsx from "clsx";

const publicMenuItems = [
  { name: "Inicio", path: "/" },
  { name: "Sobre Nosotros", path: "/company" },
  { name: "Servicios", path: "/servicios" },
  { name: "Trazabilidad", path: "/trace" },
];

const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <AppContainer>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-blood-600 bg-blood-50"
                        : "text-slate-700 hover:text-blood-600 hover:bg-slate-50"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side - CTA Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ConnectWalletButton />
            </div>

            <Link
              href="/role-registro"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white rounded-lg font-medium text-sm hover:from-blood-700 hover:to-blockchain-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Entrar a la App
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
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
        menuItems={publicMenuItems}
      />
    </header>
  );
};

export default PublicHeader;
