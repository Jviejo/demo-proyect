"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/../../src/lib/contracts/BloodTracker";
import AdminApprovalPanel from "@/components/Admin/AdminApprovalPanel";
import { motion } from "framer-motion";

const AdminApprovalRequestsPage = () => {
  const { account, web3 } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyAdminAccess();
  }, [account, web3]);

  const verifyAdminAccess = async () => {
    if (!account || !web3) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const adminStatus = await contractTracker.methods
        .isAdmin(account)
        .call();

      setIsAdmin(Boolean(adminStatus));
    } catch (error) {
      console.error("Error verifying admin access:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blood-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Not connected
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="bg-yellow-100 rounded-full p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Wallet No Conectada
          </h1>

          <p className="text-slate-600 mb-6">
            Debes conectar tu wallet para acceder al panel de administración.
          </p>

          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-blood-600 text-white font-semibold rounded-lg hover:bg-blood-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="bg-red-100 rounded-full p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Acceso Denegado
          </h1>

          <p className="text-slate-600 mb-6">
            Tu wallet <span className="font-mono text-sm block mt-2 text-slate-800">{account}</span> no
            tiene permisos de administrador para acceder a esta página.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  Si crees que deberías tener acceso, contacta a un super
                  administrador del sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-6 py-3 bg-blood-600 text-white font-semibold rounded-lg hover:bg-blood-700 transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={verifyAdminAccess}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Verificar Nuevamente
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Is admin - show panel
  return <AdminApprovalPanel />;
};

export default AdminApprovalRequestsPage;
