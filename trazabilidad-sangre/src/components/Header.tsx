"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import "./../app/globals.css";
import { AppContainer } from "../app/layout";
import ConnectWalletButton, { useWallet } from "@/components/ConnectWalletButton";
import GetWalletModal from "@/components/GetWalletModal";
import Tooltip from "./ui/Tooltip";
import Badge from "./ui/Badge";
import { truncateAddress, formatEther } from "@/lib/helpers";

const roles = [
  { name: "Register", path: "/role-registro" },
  { name: "Donor", path: "/role-donor" },
  { name: "Collector Center", path: "/role-collector-center" },
  { name: "Laboratory", path: "/role-laboratory" },
  { name: "Trader", path: "/role-traders" },
];

const getRoleName = (roleNum: number | null | undefined): string => {
  if (roleNum === null || roleNum === undefined) return "No registrado";
  switch (roleNum) {
    case 1:
      return "Collector Center";
    case 2:
      return "Laboratory";
    case 3:
      return "Trader";
    default:
      return "No registrado";
  }
};

const getRoleBadgeVariant = (roleNum: number | null | undefined): "pending" | "processing" | "completed" | "cancelled" => {
  if (roleNum === null || roleNum === undefined) return "cancelled";
  switch (roleNum) {
    case 1:
      return "processing"; // Blue for Collector Center
    case 2:
      return "completed"; // Green for Laboratory
    case 3:
      return "pending"; // Yellow for Trader
    default:
      return "cancelled";
  }
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { account, network, role, web3 } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Check if the wallet is connected
    if (
      typeof window.ethereum !== "undefined" &&
      window.ethereum.selectedAddress
    ) {
      setIsWalletConnected(true);
    }
  }, []);

  useEffect(() => {
    // Fetch balance when account changes
    const fetchBalance = async () => {
      if (account && web3) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          setBalance(formatEther(balanceWei, 4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [account, web3]);

  const handleRoleClick = (path: string) => {
    if (!isWalletConnected && path !== "/role-registro") {
      setShowWalletModal(true);
    } else {
      router.push(path);
    }
  };

  const handlePartnersClick = () => {
    router.push("/all-role-grid");
  };

  const getNetworkName = (networkId: string | null): string => {
    if (!networkId) return "Desconectado";
    switch (networkId) {
      case "1":
        return "Ethereum Mainnet";
      case "11155111":
        return "Sepolia Testnet";
      case "31337":
        return "Localhost";
      default:
        return `Network ${networkId}`;
    }
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter((p) => p);
    const breadcrumbs = [{ name: "Home", path: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const name = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ name, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="header" role="banner">
        <AppContainer>
          <div className="nav-container">
            <div className="logo-container">
              <Link href="/" className="logo-link">
                <Logo />
              </Link>
            </div>
            <nav className="nav-links" role="navigation" aria-label="Main navigation">
              {/* About Dropdown */}
              <div
                className="nav-item dropdown"
                onMouseEnter={() => setActiveDropdown("about")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="nav-link">About</div>
                <AnimatePresence>
                  {activeDropdown === "about" && (
                    <motion.div
                      className="dropdown-content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/company" className="dropdown-link">
                        Company
                      </Link>
                      <Link href="/team" className="dropdown-link">
                        Team
                      </Link>
                      <Link href="/our-promise" className="dropdown-link">
                        Our Promise
                      </Link>
                      <Link href="/where-we-are" className="dropdown-link">
                        Where we are?
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Dropdown */}
              <div
                className="nav-item dropdown"
                onMouseEnter={() => setActiveDropdown("services")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="nav-link">Our Services</div>
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      className="dropdown-content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/servicios" className="dropdown-link">
                        We can help you with
                      </Link>
                      <Link href="/inspirations" className="dropdown-link">
                        Inspiration Stories
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Events Dropdown */}
              <div
                className="nav-item dropdown"
                onMouseEnter={() => setActiveDropdown("events")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="nav-link">Current Events</div>
                <AnimatePresence>
                  {activeDropdown === "events" && (
                    <motion.div
                      className="dropdown-content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/news" className="dropdown-link">
                        In the News
                      </Link>
                      <Link href="/webinar" className="dropdown-link">
                        Webinars
                      </Link>
                      <Link href="/blooddonationeu" className="dropdown-link">
                        Blood Donation in Europe
                      </Link>
                      <Link href="/blog" className="dropdown-link">
                        Blog
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Partners Dropdown */}
              <div
                className="nav-item dropdown"
                onMouseEnter={() => setActiveDropdown("partners")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="nav-link" onClick={handlePartnersClick}>
                  Partners
                </div>
                <AnimatePresence>
                  {activeDropdown === "partners" && (
                    <motion.div
                      className="dropdown-content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {roles.map((roleItem) => (
                        <div
                          key={roleItem.name}
                          className="dropdown-link"
                          onClick={() => handleRoleClick(roleItem.path)}
                        >
                          {roleItem.name}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ConnectWalletButton />
            </nav>
          </div>
        </AppContainer>
      </header>

      {/* Breadcrumbs */}
      {pathname !== "/" && breadcrumbs.length > 1 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <AppContainer>
            <div className="py-2 px-4">
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-primary-600 font-medium">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.path}
                        className="text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </AppContainer>
        </div>
      )}

      {showWalletModal && (
        <GetWalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </>
  );
};

export default Header;
