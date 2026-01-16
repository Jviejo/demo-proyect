"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminStats from "./AdminStats";
import PendingRequestsTable from "./PendingRequestsTable";
import ApprovedCompaniesTable from "./ApprovedCompaniesTable";

const AdminApprovalPanel = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleUpdate = () => {
    // Trigger update for stats
    setUpdateTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: "pending", name: "Solicitudes Pendientes", icon: "⏱️" },
    { id: "approved", name: "Empresas Aprobadas", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blood-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-blood-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blood-600 via-blood-700 to-blockchain-600 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gestiona solicitudes de registro, aprueba empresas y administra roles del sistema
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          key={updateTrigger}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AdminStats />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg p-2 border border-slate-200 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "pending" | "approved")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blood-600 to-blood-700 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "pending" && (
            <PendingRequestsTable onUpdate={handleUpdate} />
          )}

          {activeTab === "approved" && (
            <ApprovedCompaniesTable onUpdate={handleUpdate} />
          )}
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
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
              <h3 className="font-semibold text-blue-900 mb-2">
                Guía de Administración
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Aprobar solicitudes:</strong> Revisa los detalles de
                  cada empresa antes de aprobar
                </li>
                <li>
                  • <strong>Rechazar con razón:</strong> Siempre proporciona una
                  explicación clara del rechazo
                </li>
                <li>
                  • <strong>Revocar empresas:</strong> Acción irreversible, la
                  empresa deberá solicitar nuevamente
                </li>
                <li>
                  • <strong>Modificar roles:</strong> Cambia el rol de una empresa
                  según sus capacidades actuales
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminApprovalPanel;
