"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/../../src/lib/contracts/BloodTracker";
import Button from "@/components/ui/Button";

const PendingApprovalPage = () => {
  const { account, web3 } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    loadRequestData();
  }, [account, web3]);

  const loadRequestData = async () => {
    if (!account || !web3) return;

    try {
      setIsLoading(true);
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      // Obtener ID de solicitud activa
      const requestId = await contractTracker.methods
        .getActiveRequestId(account)
        .call();

      if (requestId && requestId !== "0") {
        // Obtener detalles de la solicitud
        const request = await contractTracker.methods
          .getRequestDetails(requestId)
          .call();

        const status = Number(request.status);

        // Status: 0 = None, 1 = Pending, 2 = Approved, 3 = Rejected
        if (status === 2) {
          // APPROVED - Redirigir a la página principal de la app
          router.push("/all-role-grid");
          return;
        } else if (status === 3) {
          // REJECTED - Redirigir a página de registro para que pueda volver a intentar
          router.push("/role-registro");
          return;
        }

        setRequestData({
          id: String(requestId),
          ...request,
        });
      } else {
        // No hay solicitud activa, redirigir a registro
        router.push("/role-registro");
      }
    } catch (error) {
      console.error("Error loading request data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRequestData();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blood-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 rounded-full p-6 shadow-lg">
              <svg
                className="w-16 h-16 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Solicitud en Revisión
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tu solicitud de registro está siendo procesada por nuestros administradores
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-8"
        >
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
              <svg
                className="w-5 h-5 mr-2 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Pendiente de Aprobación
            </span>
          </div>

          {requestData && (
            <>
              {/* Request Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      ID de Solicitud
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      #{requestData.id}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Nombre de la Empresa
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {requestData.name}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Ubicación
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {requestData.location}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Rol Solicitado
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {requestData.requestedRole === "1"
                        ? "Centro de Donación"
                        : requestData.requestedRole === "2"
                        ? "Laboratorio"
                        : "Trader"}
                    </p>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="bg-gradient-to-r from-blood-50 to-blockchain-50 rounded-2xl p-6 border border-blood-200">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Dirección de Wallet
                  </p>
                  <p className="text-sm font-mono text-slate-900 break-all">
                    {requestData.applicant}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
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
                        ¿Qué sigue?
                      </h3>
                      <p className="text-sm text-blue-800">
                        Tu solicitud será revisada por nuestros administradores.
                        Recibirás una respuesta una vez que sea procesada. Puedes
                        actualizar el estado en cualquier momento haciendo clic en
                        el botón de abajo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleRefresh}
            variant="primary"
            className="min-w-[200px]"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Actualizar Estado
          </Button>

          <Button onClick={handleGoHome} variant="ghost" className="min-w-[200px]">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Volver al Inicio
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PendingApprovalPage;
