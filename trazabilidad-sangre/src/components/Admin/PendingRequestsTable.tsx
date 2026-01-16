"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/lib/contracts/BloodTracker";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { truncateAddress } from "@/lib/helpers";
import { showTransactionSuccess, showTransactionError, showTransactionPending } from "@/lib/toast";

interface PendingRequest {
  requestId: string;
  applicant: string;
  name: string;
  location: string;
  requestedRole: string;
  createdAt: string;
}

const PendingRequestsTable: React.FC<{ onUpdate?: () => void }> = ({ onUpdate }) => {
  const { account, web3 } = useWallet();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedRequestName, setSelectedRequestName] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPendingRequests();
  }, [account, web3]);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, requests]);

  const loadPendingRequests = async () => {
    if (!web3 || !account) return;

    try {
      setIsLoading(true);
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const pendingIds = await contractTracker.methods
        .getPendingRequests()
        .call();

      const pendingRequests: PendingRequest[] = [];

      for (const id of pendingIds) {
        const request = await contractTracker.methods
          .getRequestDetails(id)
          .call();

        pendingRequests.push({
          requestId: id.toString(),
          applicant: request.applicant,
          name: request.name,
          location: request.location,
          requestedRole: getRoleName(Number(request.requestedRole)),
          createdAt: new Date(Number(request.createdAt) * 1000).toLocaleString(),
        });
      }

      setRequests(pendingRequests);
      setFilteredRequests(pendingRequests);
    } catch (error) {
      console.error("Error loading pending requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(
      (req) =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRequests(filtered);
  };

  const getRoleName = (role: number): string => {
    switch (role) {
      case 1:
        return "Centro de Donación";
      case 2:
        return "Laboratorio";
      case 3:
        return "Trader";
      default:
        return "Desconocido";
    }
  };

  const handleApproveClick = (requestId: string, name: string) => {
    setSelectedRequestId(requestId);
    setSelectedRequestName(name);
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedRequestId) return;

    try {
      setIsProcessing(true);
      const pendingToastId = showTransactionPending();

      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const receipt = await contractTracker.methods
        .approveRequest(selectedRequestId)
        .send({ from: account, gas: "500000" });

      showTransactionSuccess(receipt.transactionHash, "Solicitud aprobada exitosamente");

      setShowApproveModal(false);
      setSelectedRequestId(null);
      setSelectedRequestName("");

      // Reload data
      await loadPendingRequests();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error approving request:", error);
      showTransactionError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestId || rejectionReason.trim().length < 10) {
      setValidationMessage("Por favor ingresa una razón válida (mínimo 10 caracteres)");
      setShowValidationModal(true);
      return;
    }

    try {
      setIsProcessing(true);
      const pendingToastId = showTransactionPending();

      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const receipt = await contractTracker.methods
        .rejectRequest(selectedRequestId, rejectionReason)
        .send({ from: account, gas: "500000" });

      showTransactionSuccess(receipt.transactionHash, "Solicitud rechazada");

      setShowRejectModal(false);
      setSelectedRequestId(null);
      setRejectionReason("");

      // Reload data
      await loadPendingRequests();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      showTransactionError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header con búsqueda */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Solicitudes Pendientes ({filteredRequests.length})
            </h2>

            <div className="w-full sm:w-auto flex gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent"
              />
              <button
                onClick={loadPendingRequests}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Actualizar"
              >
                <svg
                  className="w-6 h-6 text-slate-600"
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
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No hay solicitudes pendientes</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.requestId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{request.requestId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                      {truncateAddress(request.applicant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {request.requestedRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {request.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {request.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproveClick(request.requestId, request.name)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => handleRejectClick(request.requestId)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de aprobación */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedRequestId(null);
          setSelectedRequestName("");
        }}
        onConfirm={handleApproveConfirm}
        title="Aprobar Solicitud"
        message={`¿Estás seguro de aprobar la solicitud de "${selectedRequestName}"? Esta acción otorgará acceso a la plataforma.`}
        confirmText="Sí, Aprobar"
        cancelText="Cancelar"
        variant="success"
        loading={isProcessing}
      />

      {/* Modal de validación */}
      <ConfirmModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        onConfirm={() => setShowValidationModal(false)}
        title="Atención"
        message={validationMessage}
        confirmText="Entendido"
        cancelText="Cerrar"
        variant="primary"
      />

      {/* Modal de rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Rechazar Solicitud #{selectedRequestId}
            </h3>

            <p className="text-slate-600 mb-4">
              Por favor ingresa la razón del rechazo (mínimo 10 caracteres):
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Documentación incompleta, información incorrecta..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent resize-none"
              rows={4}
              autoFocus
            />

            <p className="text-xs text-slate-500 mt-2 mb-4">
              {rejectionReason.length}/10 caracteres mínimos
            </p>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequestId(null);
                  setRejectionReason("");
                }}
                variant="ghost"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRejectConfirm}
                variant="danger"
                disabled={isProcessing || rejectionReason.trim().length < 10}
                loading={isProcessing}
              >
                Confirmar Rechazo
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PendingRequestsTable;
