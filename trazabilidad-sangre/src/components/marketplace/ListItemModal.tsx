'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaEthereum } from 'react-icons/fa';
import { useWallet } from '../ConnectWalletButton';
import { abi as abiTracker } from '@/lib/contracts/BloodTracker';
import { abi as abiDerivative } from '@/lib/contracts/BloodDerivative';
import { getDerivativeTypeFromNumber } from '../Marketplace';
import { Button } from '../ui/Button';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons';

interface TokenInterface {
  tokenAddress: string;
  tokenId: string;
  typeString: string;
  typeNumber: number;
  image: string;
}

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const getImageFromDerivative = (derivativeType: number) => {
  switch (derivativeType) {
    case 1:
      return '/plasma.png';
    case 2:
      return '/erythrocytes.png';
    case 3:
      return '/plaquetes.png';
    default:
      return '/addItem.png';
  }
};

const getDerivativeIcon = (typeString: string) => {
  switch (typeString) {
    case 'PLASMA':
      return <PlasmaIcon />;
    case 'ERYTHROCYTES':
      return <ErythrocytesIcon />;
    case 'PLATELETS':
      return <PlateletsIcon />;
    default:
      return null;
  }
};

const derivativeTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  PLASMA: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  ERYTHROCYTES: {
    bg: 'bg-blood-100',
    text: 'text-blood-800',
    border: 'border-blood-300',
  },
  PLATELETS: {
    bg: 'bg-blockchain-100',
    text: 'text-blockchain-800',
    border: 'border-blockchain-300',
  },
};

export const ListItemModal: React.FC<ListItemModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { account, web3 } = useWallet();
  const [tokensOfTheAccount, setTokensOfTheAccount] = useState<TokenInterface[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);

  const getTokensOfTheAccount = async () => {
    if (!web3 || !account) {
      setIsLoadingTokens(false);
      return;
    }

    setIsLoadingTokens(true);
    try {
      const contractDerivativeAddress = process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS;
      if (!contractDerivativeAddress) return;

      const contractDerivative = new web3.eth.Contract(abiDerivative, contractDerivativeAddress);
      const balance = await contractDerivative.methods.balanceOf(account).call({ from: account });
      const balanceNum = Number(balance);

      if (!balanceNum) {
        setTokensOfTheAccount([]);
        setIsLoadingTokens(false);
        return;
      }

      const tokens: TokenInterface[] = [];
      for (let index = 0; index < balanceNum; index++) {
        const tokenId = await contractDerivative.methods
          .tokenOfOwnerByIndex(account, index)
          .call({ from: account });

        const product = await contractDerivative.methods.products(tokenId).call();
        const derivativeType = Number(product.derivative);
        const typeString = getDerivativeTypeFromNumber(derivativeType);

        tokens.push({
          tokenAddress: contractDerivativeAddress,
          tokenId: tokenId.toString(),
          typeString,
          typeNumber: derivativeType,
          image: getImageFromDerivative(derivativeType),
        });
      }

      setTokensOfTheAccount(tokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      showTransactionError(error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getTokensOfTheAccount();
      setSelectedToken('');
      setPrice('');
    }
  }, [isOpen, web3, account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!price || !selectedToken || !web3 || !account) {
      return;
    }

    setIsLoading(true);
    showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );
      const contractDerivative = new web3.eth.Contract(
        abiDerivative,
        process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS
      );

      const priceWei = web3.utils.toWei(price, 'ether');

      // Approve
      await contractDerivative.methods
        .approve(process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS, Number(selectedToken))
        .send({ from: account, gas: '1000000', gasPrice: '1000000000' });

      // List item
      const tx = await contractTracker.methods
        .listItem(process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS, Number(selectedToken), priceWei)
        .send({ from: account, gas: '1000000', gasPrice: '1000000000' });

      showTransactionSuccess(tx.transactionHash);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Error listing item:', error);
      showTransactionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTokenData = tokensOfTheAccount.find((t) => t.tokenId === selectedToken);
  const typeColor = selectedTokenData
    ? derivativeTypeColors[selectedTokenData.typeString] || {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-300',
      }
    : null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-blockchain-600 px-6 py-5 flex items-center justify-between">
                  <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
                    <span>💼</span>
                    Listar Derivado en Venta
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-white/80 hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Selección de Token */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Selecciona el derivado a vender
                    </label>

                    {isLoadingTokens ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                      </div>
                    ) : tokensOfTheAccount.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <div className="text-4xl mb-3">📦</div>
                        <p className="text-slate-600 font-medium">No tienes derivados para vender</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Procesa una donación en el laboratorio para obtener derivados
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {tokensOfTheAccount.map((token) => {
                          const isSelected = selectedToken === token.tokenId;
                          const tokenColor = derivativeTypeColors[token.typeString];

                          return (
                            <motion.button
                              key={token.tokenId}
                              type="button"
                              onClick={() => setSelectedToken(token.tokenId)}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? `${tokenColor.border} bg-gradient-to-br ${tokenColor.bg} shadow-lg scale-105`
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                              }`}
                              whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-success-500 text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-shrink-0">{getDerivativeIcon(token.typeString)}</div>
                                <div className="flex-1 text-left">
                                  <p className={`font-bold text-sm ${tokenColor.text}`}>
                                    {token.typeString}
                                  </p>
                                  <p className="text-xs text-slate-500">ID: {token.tokenId}</p>
                                </div>
                              </div>

                              <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                                <img
                                  src={token.image}
                                  alt={token.typeString}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Preview del token seleccionado */}
                  <AnimatePresence>
                    {selectedTokenData && typeColor && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-xl border-2 ${typeColor.border} ${typeColor.bg}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getDerivativeIcon(selectedTokenData.typeString)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold ${typeColor.text}`}>
                              {selectedTokenData.typeString} #{selectedTokenData.tokenId}
                            </p>
                            <p className="text-sm text-slate-600">Derivado seleccionado</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input de Precio */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
                      Precio de Venta
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEthereum className="text-blockchain-600 text-xl" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        step="0.0001"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-12 pr-16 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl focus:border-blockchain-500 focus:ring-4 focus:ring-blockchain-100 transition-all"
                        placeholder="0.00"
                        required
                        disabled={!selectedToken}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-medium">ETH</span>
                      </div>
                    </div>
                    {price && parseFloat(price) > 0 && (
                      <p className="mt-2 text-sm text-slate-600">
                        Recibirás aproximadamente{' '}
                        <span className="font-bold text-blockchain-600">{price} ETH</span> por esta venta
                      </p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      disabled={!selectedToken || !price || parseFloat(price) <= 0 || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Listando...
                        </>
                      ) : (
                        <>
                          <span>💼</span>
                          Listar en Marketplace
                        </>
                      )}
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
