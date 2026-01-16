"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/components/ConnectWalletButton";
import { abi as abiTracker } from "@/../../src/lib/contracts/BloodTracker";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { truncateAddress } from "@/lib/helpers";
import { showTransactionSuccess, showTransactionError, showTransactionPending } from "@/lib/toast";

interface ApprovedCompany {
  address: string;
  name: string;
  location: string;
  role: number;
  roleName: string;
}

const ApprovedCompaniesTable: React.FC<{ onUpdate?: () => void }> = ({ onUpdate }) => {
  const { account, web3 } = useWallet();
  const [companies, setCompanies] = useState<ApprovedCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<ApprovedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<ApprovedCompany | null>(null);
  const [newRole, setNewRole] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadApprovedCompanies();
  }, [account, web3]);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, companies]);

  const loadApprovedCompanies = async () => {
    if (!web3 || !account) return;

    try {
      setIsLoading(true);
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const totalRequests = await contractTracker.methods.getTotalRequests().call();
      const totalNum = Number(totalRequests);

      const approvedCompanies: ApprovedCompany[] = [];

      for (let i = 1; i <= totalNum; i++) {
        const request = await contractTracker.methods.getRequestDetails(i).call();

        if (Number(request.status) === 2) { // APPROVED
          approvedCompanies.push({
            address: request.applicant,
            name: request.name,
            location: request.location,
            role: Number(request.requestedRole),
            roleName: getRoleName(Number(request.requestedRole)),
          });
        }
      }

      setCompanies(approvedCompanies);
      setFilteredCompanies(approvedCompanies);
    } catch (error) {
      console.error("Error loading approved companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCompanies = () => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCompanies(filtered);
  };

  const getRoleName = (role: number): string => {
    switch (role) {
      case 1: return "Centro de Donación";
      case 2: return "Laboratorio";
      case 3: return "Trader";
      default: return "Desconocido";
    }
  };

  const handleRevokeClick = (company: ApprovedCompany) => {
    setSelectedCompany(company);
    setShowRevokeModal(true);
  };

  const handleRevokeConfirm = async () => {
    if (!selectedCompany) return;

    try {
      setIsProcessing(true);
      const pendingToastId = showTransactionPending();

      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const receipt = await contractTracker.methods
        .revokeCompany(selectedCompany.address)
        .send({ from: account, gas: "500000" });

      showTransactionSuccess(receipt.transactionHash, "Empresa revocada exitosamente");

      setShowRevokeModal(false);
      setSelectedCompany(null);

      await loadApprovedCompanies();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error revoking company:", error);
      showTransactionError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModifyRoleClick = (company: ApprovedCompany) => {
    setSelectedCompany(company);
    setNewRole(company.role);
    setShowModifyModal(true);
  };

  const handleModifyRoleConfirm = async () => {
    if (!selectedCompany || newRole === selectedCompany.role) {
      setValidationMessage("Por favor selecciona un rol diferente");
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
        .modifyRole(selectedCompany.address, newRole)
        .send({ from: account, gas: "500000" });

      showTransactionSuccess(receipt.transactionHash, "Rol modificado exitosamente");

      setShowModifyModal(false);
      setSelectedCompany(null);

      await loadApprovedCompanies();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error modifying role:", error);
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
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Empresas Aprobadas ({filteredCompanies.length})
            </h2>

            <div className="w-full sm:w-auto flex gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent"
              />
              <button
                onClick={loadApprovedCompanies}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Actualizar"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {filteredCompanies.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg">No hay empresas aprobadas</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{truncateAddress(company.address)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {company.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{company.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleModifyRoleClick(company)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          ✏️ Modificar Rol
                        </button>
                        <button
                          onClick={() => handleRevokeClick(company)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          🚫 Revocar
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

      {/* Modal de revocar */}
      <ConfirmModal
        isOpen={showRevokeModal}
        onClose={() => {
          setShowRevokeModal(false);
          setSelectedCompany(null);
        }}
        onConfirm={handleRevokeConfirm}
        title="Revocar Empresa"
        message={selectedCompany ? `¿Estás seguro de revocar el acceso de "${selectedCompany.name}"? Esta acción es irreversible y la empresa dejará de poder operar en la plataforma.` : ""}
        confirmText="Sí, Revocar"
        cancelText="Cancelar"
        variant="danger"
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

      {/* Modal de modificar rol */}
      {showModifyModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Modificar Rol de {selectedCompany.name}
            </h3>

            <p className="text-slate-600 mb-4">Rol actual: <span className="font-semibold">{selectedCompany.roleName}</span></p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nuevo Rol:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent"
              >
                <option value={1}>Centro de Donación</option>
                <option value={2}>Laboratorio</option>
                <option value={3}>Trader</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowModifyModal(false);
                  setSelectedCompany(null);
                }}
                variant="ghost"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleModifyRoleConfirm}
                variant="primary"
                disabled={isProcessing || newRole === selectedCompany.role}
                loading={isProcessing}
              >
                Confirmar Cambio
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ApprovedCompaniesTable;
