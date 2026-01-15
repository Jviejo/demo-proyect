"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/../../src/lib/contracts/BloodTracker";

interface StatsData {
  pending: number;
  approved: number;
  rejected: number;
  revoked: number;
}

const AdminStats: React.FC = () => {
  const { account, web3 } = useWallet();
  const [stats, setStats] = useState<StatsData>({
    pending: 0,
    approved: 0,
    rejected: 0,
    revoked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [account, web3]);

  const loadStats = async () => {
    if (!web3 || !account) return;

    try {
      setIsLoading(true);
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      // Obtener total de solicitudes
      const totalRequests = await contractTracker.methods
        .getTotalRequests()
        .call();

      const totalNum = Number(totalRequests);

      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let revokedCount = 0;

      // Iterar sobre todas las solicitudes para contar estados
      for (let i = 1; i <= totalNum; i++) {
        const request = await contractTracker.methods
          .getRequestDetails(i)
          .call();

        const status = Number(request.status);

        switch (status) {
          case 1: // PENDING
            pendingCount++;
            break;
          case 2: // APPROVED
            approvedCount++;
            break;
          case 3: // REJECTED
            rejectedCount++;
            break;
          case 4: // REVOKED
            revokedCount++;
            break;
        }
      }

      setStats({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        revoked: revokedCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Pendientes",
      value: stats.pending,
      icon: "⏱️",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Aprobadas",
      value: stats.approved,
      icon: "🩸",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Rechazadas",
      value: stats.rejected,
      icon: "❌",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Revocadas",
      value: stats.revoked,
      icon: "🚫",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-pulse"
          >
            <div className="h-12 bg-slate-200 rounded mb-4"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} rounded-2xl shadow-lg p-6 border ${card.borderColor} hover:shadow-xl transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.iconBg} rounded-full p-3`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <button
              onClick={loadStats}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Actualizar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">
              {card.title}
            </h3>
            <p className={`text-4xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
