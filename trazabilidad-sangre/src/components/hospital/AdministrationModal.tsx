'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useWallet } from '../ConnectWalletButton';
import { abi as abiTracker } from '@/lib/contracts/BloodTracker';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';
import { motion } from 'framer-motion';
import { getDerivativeTypeName } from '@/lib/helpers';

interface AdministrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: {
    tokenId: number;
    type: 'blood_bag' | 'derivative';
    derivativeType?: number;
  } | null;
}

export const AdministrationModal: React.FC<AdministrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item,
}) => {
  const { account, web3 } = useWallet();
  const [patientId, setPatientId] = useState('');
  const [medicalReason, setMedicalReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Resetear formulario al cerrar
  const handleClose = () => {
    setPatientId('');
    setMedicalReason('');
    setIsConfirmed(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !medicalReason || !isConfirmed || !web3 || !account || !item) {
      return;
    }

    setIsLoading(true);
    showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const isBloodBag = item.type === 'blood_bag';

      // Llamar a la función registerPatientAdministration
      const tx = await contractTracker.methods
        .registerPatientAdministration(
          item.tokenId,
          isBloodBag,
          patientId,
          medicalReason
        )
        .send({
          from: account,
          gas: '1000000',
          gasPrice: '1000000000',
        });

      showTransactionSuccess(tx.transactionHash);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error registering patient administration:', error);
      showTransactionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  const isBloodBag = item.type === 'blood_bag';
  const itemLabel = isBloodBag
    ? `Bolsa Completa #${item.tokenId}`
    : `${getDerivativeTypeName(item.derivativeType || 0)} #${item.tokenId}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <Dialog.Title className="text-xl font-bold text-slate-900">
                    Registrar Administración a Paciente
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Contenido */}
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-6 space-y-4">
                    {/* Item seleccionado */}
                    <div className="bg-medical-50 border border-medical-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Item a Administrar:</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-medical-800">{itemLabel}</span>
                        <Badge variant={isBloodBag ? 'success' : 'info'}>
                          {isBloodBag ? 'Sangre Completa' : 'Derivado'}
                        </Badge>
                      </div>
                    </div>

                    {/* Advertencia de privacidad */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">
                            Protección de Privacidad
                          </p>
                          <p className="text-xs text-amber-800">
                            El ID del paciente debe ser un hash o identificador encriptado para proteger
                            la privacidad del paciente según las regulaciones HIPAA/GDPR.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Patient ID */}
                    <div>
                      <label htmlFor="patientId" className="block text-sm font-semibold text-slate-700 mb-2">
                        Patient ID (Hash/Encriptado) *
                      </label>
                      <input
                        type="text"
                        id="patientId"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent font-mono text-sm"
                        placeholder="0x..."
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Ejemplo: Hash SHA-256 del ID real del paciente
                      </p>
                    </div>

                    {/* Medical Reason */}
                    <div>
                      <label htmlFor="medicalReason" className="block text-sm font-semibold text-slate-700 mb-2">
                        Motivo Médico *
                      </label>
                      <textarea
                        id="medicalReason"
                        value={medicalReason}
                        onChange={(e) => setMedicalReason(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent resize-none"
                        placeholder="Describe el motivo médico de esta administración..."
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {medicalReason.length}/500 caracteres
                      </p>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isConfirmed}
                          onChange={(e) => setIsConfirmed(e.target.checked)}
                          className="mt-1 h-4 w-4 text-medical-600 focus:ring-medical-500 border-slate-300 rounded"
                          disabled={isLoading}
                        />
                        <span className="text-sm text-slate-700">
                          Confirmo que este producto ha sido administrado al paciente y que la información
                          proporcionada es correcta. Esta acción quedará registrada permanentemente en la
                          blockchain.
                        </span>
                      </label>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">Nota:</span> Una vez registrada la administración,
                        este token quedará marcado como usado y no podrá ser administrado nuevamente.
                      </p>
                    </div>
                  </div>

                  {/* Footer con botones */}
                  <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      fullWidth
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      fullWidth
                      disabled={!patientId || !medicalReason || !isConfirmed || isLoading}
                      loading={isLoading}
                    >
                      {isLoading ? 'Registrando...' : 'Registrar Administración'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdministrationModal;
