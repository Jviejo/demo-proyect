"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/components/ConnectWalletButton";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import { truncateAddress, formatEther } from "@/lib/helpers";
import { motion } from "framer-motion";

const getRoleName = (roleNum: Number | null): string => {
  if (roleNum === null) return "No registrado";
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

const getRoleBadgeVariant = (
  roleNum: Number | null
): "pending" | "processing" | "completed" | "cancelled" => {
  if (roleNum === null) return "cancelled";
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

const getNetworkName = (networkId: string | null): string => {
  if (!networkId) return "Desconectado";
  // Trias Testnet chain ID is 0x13881 (80001 in decimal)
  if (networkId === "0x13881" || networkId === "80001") {
    return "Trias Testnet";
  }
  // Anvil local network
  if (networkId === "0x7a69" || networkId === "31337") {
    return "Anvil Local";
  }
  return `Chain ${networkId}`;
};

interface WalletInfoProps {
  variant?: "full" | "compact";
}

const WalletInfo: React.FC<WalletInfoProps> = ({ variant = "full" }) => {
  const { account, network, role, web3 } = useWallet();
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
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

  if (!account) {
    return null;
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
      >
        <Tooltip content={account}>
          <span className="font-mono text-sm text-gray-700">
            {truncateAddress(account, 4)}
          </span>
        </Tooltip>
        <Badge variant={getRoleBadgeVariant(role)} size="sm">
          {getRoleName(role)}
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 p-4 bg-gradient-to-br from-blood-50 to-blockchain-50 rounded-lg border border-blood-100"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Cuenta</span>
          <Tooltip content={account}>
            <span className="font-mono text-sm font-medium text-gray-900">
              {truncateAddress(account, 6)}
            </span>
          </Tooltip>
        </div>
        <Badge variant={getRoleBadgeVariant(role)}>
          {getRoleName(role)}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-blood-100">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Red</span>
          <span className="text-sm font-medium text-blockchain-700">
            {getNetworkName(network)}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-xs font-medium text-gray-600">Balance</span>
          <span className="font-mono text-sm font-bold text-medical-600">
            {balance} ETH
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletInfo;
