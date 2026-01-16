"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/lib/contracts/BloodTracker";
import Button from "@/components/ui/Button";

interface RejectedComponentProps {
  requestId?: string;
}

const RejectedComponent: React.FC<RejectedComponentProps> = ({ requestId }) => {
  const { account, web3 } = useWallet();
  const router = useRouter();
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRejectionReason();
  }, [account, web3, requestId]);

  const loadRejectionReason = async () => {
    if (!account || !web3) return;

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const activeRequestId =
        requestId ||
        (await contractTracker.methods.getActiveRequestId(account).call());

      if (activeRequestId && activeRequestId !== "0") {
        const request = await contractTracker.methods
          .getRequestDetails(activeRequestId)
          .call();
        setRejectionReason(request.rejectionReason || "No se proporcionó razón");
      }
    } catch (error) {
      console.error("Error loading rejection reason:", error);
      setRejectionReason("Error al cargar la razón del rechazo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRequest = () => {
    router.push("/role-registro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6 shadow-lg">
              <svg
                className="w-16 h-16 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-red-100 text-red-800 border-2 border-red-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Solicitud Rechazada
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Solicitud No Aprobada
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 mb-8">
            Lamentablemente, tu solicitud de registro no ha sido aprobada.
          </p>

          {/* Rejection Reason */}
          {!isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Razón del Rechazo:
                  </h3>
                  <p className="text-sm text-red-800">{rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 text-left">
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
                  ¿Qué puedes hacer?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Revisa la razón del rechazo cuidadosamente</li>
                  <li>• Corrige la información necesaria</li>
                  <li>• Envía una nueva solicitud con los datos correctos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleNewRequest}
              variant="success"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Solicitar Nuevamente
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectedComponent;
