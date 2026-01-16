'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { useWallet } from '../ConnectWalletButton';
import { abi as abiTracker } from '@/lib/contracts/BloodTracker';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';
import { motion } from 'framer-motion';
import { getDerivativeTypeName, getProductTypeName } from '@/lib/helpers';
import { ProductType } from '@/lib/types';
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons';

interface InventoryItem {
  tokenId: number;
  derivativeType: number;
  tokenIdOrigin: number;
  isUsedInBatch: boolean;
}

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableDerivatives: InventoryItem[];
}

const productTypes = [
  { value: ProductType.SERUM, label: 'Serum Facial', description: 'Serum anti-edad con componentes sanguíneos' },
  { value: ProductType.CREAM, label: 'Crema Anti-Edad', description: 'Crema rejuvenecedora enriquecida' },
  { value: ProductType.MASK, label: 'Mascarilla Facial', description: 'Mascarilla revitalizante' },
  { value: ProductType.TREATMENT, label: 'Tratamiento Capilar', description: 'Tratamiento para el cabello' },
  { value: ProductType.SUPPLEMENT, label: 'Suplemento Nutricional', description: 'Suplemento con derivados sanguíneos' },
];

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableDerivatives,
}) => {
  const { account, web3 } = useWallet();
  const [selectedDerivatives, setSelectedDerivatives] = useState<number[]>([]);
  const [productType, setProductType] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Resetear formulario al cerrar
  const handleClose = () => {
    setSelectedDerivatives([]);
    setProductType('');
    setIsConfirmed(false);
    onClose();
  };

  // Manejar selección/deselección de derivados
  const toggleDerivative = (tokenId: number) => {
    setSelectedDerivatives((prev) =>
      prev.includes(tokenId)
        ? prev.filter((id) => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDerivatives.length === 0 || !productType || !isConfirmed || !web3 || !account) {
      return;
    }

    setIsLoading(true);
    showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      // Llamar a la función createManufacturedBatch
      const tx = await contractTracker.methods
        .createManufacturedBatch(selectedDerivatives, productType)
        .send({
          from: account,
          gas: '2000000',
          gasPrice: '1000000000',
        });

      showTransactionSuccess(tx.transactionHash);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating manufactured batch:', error);
      showTransactionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar icono según tipo de derivado
  const renderDerivativeIcon = (type: number) => {
    switch (type) {
      case 1:
        return <PlasmaIcon className="w-8 h-8" />;
      case 2:
        return <ErythrocytesIcon className="w-8 h-8" />;
      case 3:
        return <PlateletsIcon className="w-8 h-8" />;
      default:
        return <BeakerIcon className="w-8 h-8 text-slate-400" />;
    }
  };

  const selectedProductType = productTypes.find((p) => p.value === productType);

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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BeakerIcon className="h-8 w-8 text-blockchain-600" />
                    <Dialog.Title className="text-xl font-bold text-slate-900">
                      Crear Nuevo Lote de Producto
                    </Dialog.Title>
                  </div>
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
                  <div className="px-6 py-6 space-y-6">
                    {/* Tipo de Producto */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Tipo de Producto *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {productTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setProductType(type.value)}
                            disabled={isLoading}
                            className={`
                              relative border-2 rounded-lg p-4 text-left transition-all
                              ${
                                productType === type.value
                                  ? 'border-blockchain-500 bg-blockchain-50 shadow-md'
                                  : 'border-slate-200 hover:border-blockchain-300 hover:bg-slate-50'
                              }
                              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {productType === type.value && (
                              <div className="absolute top-2 right-2">
                                <CheckCircleIcon className="h-5 w-5 text-blockchain-600" />
                              </div>
                            )}
                            <p className="font-semibold text-slate-800 mb-1">{type.label}</p>
                            <p className="text-xs text-slate-600">{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selección de Derivados */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Selecciona Derivados para el Lote * (mínimo 1)
                      </label>

                      {availableDerivatives.length === 0 ? (
                        <div className="bg-slate-50 rounded-lg p-6 text-center">
                          <p className="text-slate-600">No hay derivados disponibles en inventario</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1 border border-slate-200 rounded-lg">
                          {availableDerivatives.map((derivative) => (
                            <motion.button
                              key={derivative.tokenId}
                              type="button"
                              onClick={() => toggleDerivative(derivative.tokenId)}
                              disabled={isLoading}
                              className={`
                                relative border-2 rounded-lg p-3 text-left transition-all
                                ${
                                  selectedDerivatives.includes(derivative.tokenId)
                                    ? 'border-success-500 bg-success-50 shadow-md'
                                    : 'border-slate-200 hover:border-success-300 hover:bg-slate-50'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                              whileHover={!isLoading ? { scale: 1.02 } : {}}
                              whileTap={!isLoading ? { scale: 0.98 } : {}}
                            >
                              {/* Checkbox indicator */}
                              <div className="absolute top-2 right-2">
                                <input
                                  type="checkbox"
                                  checked={selectedDerivatives.includes(derivative.tokenId)}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-success-600 focus:ring-success-500 border-slate-300 rounded"
                                  disabled={isLoading}
                                />
                              </div>

                              {/* Icono y datos */}
                              <div className="flex items-center gap-3 pr-8">
                                {renderDerivativeIcon(derivative.derivativeType)}
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-800 text-sm">
                                    {getDerivativeTypeName(derivative.derivativeType)}
                                  </p>
                                  <p className="text-xs text-slate-500">ID: {derivative.tokenId}</p>
                                  <p className="text-xs text-slate-500">Origen: #{derivative.tokenIdOrigin}</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Contador de seleccionados */}
                      {selectedDerivatives.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 bg-success-50 border border-success-200 rounded-lg p-3"
                        >
                          <p className="text-sm text-success-800">
                            <span className="font-semibold">{selectedDerivatives.length}</span> derivado(s) seleccionado(s)
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Preview del Lote */}
                    {selectedProductType && selectedDerivatives.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blockchain-50 border border-blockchain-200 rounded-lg p-4"
                      >
                        <p className="text-sm font-semibold text-slate-700 mb-2">Vista Previa del Lote:</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Producto:</span>
                            <span className="font-semibold text-blockchain-800">
                              {getProductTypeName(selectedProductType.value)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Derivados:</span>
                            <span className="font-semibold text-blockchain-800">
                              {selectedDerivatives.length} unidades
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">IDs:</span>
                            <span className="font-mono text-xs text-slate-700">
                              {selectedDerivatives.join(', ')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Confirmation Checkbox */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isConfirmed}
                          onChange={(e) => setIsConfirmed(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blockchain-600 focus:ring-blockchain-500 border-slate-300 rounded"
                          disabled={isLoading}
                        />
                        <span className="text-sm text-slate-700">
                          Confirmo que los derivados seleccionados serán utilizados para crear este lote de
                          producto. Los derivados quedarán marcados como usados y no podrán reutilizarse en
                          otros lotes. Esta acción es permanente y quedará registrada en la blockchain.
                        </span>
                      </label>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">Nota:</span> El lote se creará con un ID único
                        generado automáticamente. Todos los derivados seleccionados quedarán vinculados
                        permanentemente a este lote para trazabilidad completa.
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
                      disabled={
                        selectedDerivatives.length === 0 ||
                        !productType ||
                        !isConfirmed ||
                        isLoading
                      }
                      loading={isLoading}
                    >
                      {isLoading ? 'Creando Lote...' : 'Crear Lote de Producto'}
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

export default CreateBatchModal;
