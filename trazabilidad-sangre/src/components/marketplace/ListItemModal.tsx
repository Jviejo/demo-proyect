'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaEthereum } from 'react-icons/fa';
import { useWallet } from '../ConnectWalletButton';
import { abi as abiTracker } from '@/lib/contracts/BloodTracker';
import { abi as abiDerivative } from '@/lib/contracts/BloodDerivative';
import { abi as abiDonation } from '@/lib/contracts/BloodDonation';
import { getDerivativeTypeFromNumber } from '../Marketplace';
import { Button } from '../ui/Button';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons';
import { Badge } from '../ui/Badge';

interface TokenInterface {
  tokenAddress: string;
  tokenId: string;
  typeString: string;
  typeNumber: number;
  image: string;
  isBloodBag: boolean;
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
      return '/platelets.png';
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
  BLOOD_BAG: {
    bg: 'bg-blood-100',
    text: 'text-blood-800',
    border: 'border-blood-300',
  },
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
  const [inventoryType, setInventoryType] = useState<'blood_bags' | 'derivatives'>('derivatives');
  const [tokensOfTheAccount, setTokensOfTheAccount] = useState<TokenInterface[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);

  // Obtener tokens del usuario (bolsas de sangre completas)
  const getBloodBagTokens = async () => {
    if (!web3 || !account) return [];

    try {
      const contractDonationAddress = process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS;
      if (!contractDonationAddress) return [];

      const contractDonation = new web3.eth.Contract(abiDonation, contractDonationAddress);
      const balance = await contractDonation.methods.balanceOf(account).call({ from: account });
      const balanceNum = Number(balance);

      if (!balanceNum) return [];

      const tokens: TokenInterface[] = [];
      for (let index = 0; index < balanceNum; index++) {
        const tokenId = await contractDonation.methods
          .tokenOfOwnerByIndex(account, index)
          .call({ from: account });

        tokens.push({
          tokenAddress: contractDonationAddress,
          tokenId: tokenId.toString(),
          typeString: 'BLOOD_BAG',
          typeNumber: 0,
          image: '/blood-bag.png',
          isBloodBag: true,
        });
      }

      return tokens;
    } catch (error) {
      console.error('Error fetching blood bag tokens:', error);
      return [];
    }
  };

  // Obtener tokens del usuario (derivados)
  const getDerivativeTokens = async () => {
    if (!web3 || !account) return [];

    try {
      const contractDerivativeAddress = process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS;
      if (!contractDerivativeAddress) return [];

      const contractDerivative = new web3.eth.Contract(abiDerivative, contractDerivativeAddress);
      const balance = await contractDerivative.methods.balanceOf(account).call({ from: account });
      const balanceNum = Number(balance);

      if (!balanceNum) return [];

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
          isBloodBag: false,
        });
      }

      return tokens;
    } catch (error) {
      console.error('Error fetching derivative tokens:', error);
      return [];
    }
  };

  // Cargar tokens según el tipo de inventario seleccionado
  const loadTokens = async () => {
    setIsLoadingTokens(true);
    try {
      if (inventoryType === 'blood_bags') {
        const tokens = await getBloodBagTokens();
        setTokensOfTheAccount(tokens);
      } else {
        const tokens = await getDerivativeTokens();
        setTokensOfTheAccount(tokens);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      showTransactionError(error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTokens();
      setSelectedToken('');
      setPrice('');
    }
  }, [isOpen, inventoryType, web3, account]);

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

      const selectedTokenData = tokensOfTheAccount.find((t) => t.tokenId === selectedToken);
      if (!selectedTokenData) return;

      const priceWei = web3.utils.toWei(price, 'ether');
      const tokenContract = selectedTokenData.isBloodBag
        ? new web3.eth.Contract(abiDonation, selectedTokenData.tokenAddress)
        : new web3.eth.Contract(abiDerivative, selectedTokenData.tokenAddress);

      // Paso 1: Aprobar al BloodTracker para transferir el token
      await tokenContract.methods
        .approve(process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS, Number(selectedToken))
        .send({ from: account, gas: '1000000', gasPrice: '1000000000' });

      // Paso 2: Listar item en el marketplace
      const tx = await contractTracker.methods
        .listItem(selectedTokenData.tokenAddress, Number(selectedToken), priceWei)
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <Dialog.Title className="text-xl font-bold text-slate-900">
                    Listar Item en Marketplace
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Selector de tipo de inventario */}
                <div className="px-6 pt-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={inventoryType === 'blood_bags' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setInventoryType('blood_bags');
                        setSelectedToken('');
                      }}
                    >
                      🩸 Bolsas Completas
                    </Button>
                    <Button
                      variant={inventoryType === 'derivatives' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setInventoryType('derivatives');
                        setSelectedToken('');
                      }}
                    >
                      🧪 Derivados
                    </Button>
                  </div>
                </div>

                {/* Contenido */}
                <form onSubmit={handleSubmit}>
                  <div className="px-6 pb-6 space-y-4">
                    {/* Selección de token */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Selecciona {inventoryType === 'blood_bags' ? 'una bolsa' : 'un derivado'}
                      </label>

                      {isLoadingTokens ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blockchain-600"></div>
                        </div>
                      ) : tokensOfTheAccount.length === 0 ? (
                        <div className="bg-slate-50 rounded-lg p-6 text-center">
                          <p className="text-slate-600">
                            No tienes {inventoryType === 'blood_bags' ? 'bolsas completas' : 'derivados'} en tu inventario
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                          {tokensOfTheAccount.map((token) => (
                            <motion.button
                              key={token.tokenId}
                              type="button"
                              onClick={() => setSelectedToken(token.tokenId)}
                              className={`
                                relative border-2 rounded-lg p-3 text-left transition-all
                                ${
                                  selectedToken === token.tokenId
                                    ? 'border-blockchain-500 bg-blockchain-50 shadow-md'
                                    : 'border-slate-200 hover:border-blockchain-300 hover:bg-slate-50'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Badge del tipo */}
                              <div className="absolute top-2 right-2">
                                <Badge variant={token.isBloodBag ? 'success' : 'info'} className="text-xs">
                                  {token.typeString}
                                </Badge>
                              </div>

                              {/* Icono o imagen */}
                              <div className="flex items-center gap-3 mb-2">
                                {token.isBloodBag ? (
                                  <div className="text-3xl">🩸</div>
                                ) : (
                                  <div className="w-10 h-10">
                                    {getDerivativeIcon(token.typeString)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-800 text-sm">
                                    {token.isBloodBag ? 'Bolsa' : token.typeString}
                                  </p>
                                  <p className="text-xs text-slate-500">ID: {token.tokenId}</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Input de precio */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
                        Precio en ETH
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEthereum className="text-blockchain-600 text-xl" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          step="0.001"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blockchain-500 focus:border-transparent"
                          placeholder="0.001"
                          required
                        />
                      </div>
                    </div>

                    {/* Preview del token seleccionado */}
                    {selectedTokenData && typeColor && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          rounded-lg p-4 border-2
                          ${typeColor.bg} ${typeColor.border}
                        `}
                      >
                        <p className="text-sm font-semibold text-slate-700 mb-1">Item Seleccionado:</p>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${typeColor.text}`}>
                            {selectedTokenData.typeString} #{selectedTokenData.tokenId}
                          </span>
                          {price && (
                            <span className="flex items-center gap-1 text-slate-800">
                              <FaEthereum />
                              <span className="font-bold">{price} ETH</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer con botones */}
                  <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      fullWidth
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      fullWidth
                      disabled={!selectedToken || !price || isLoading}
                      loading={isLoading}
                    >
                      {isLoading ? 'Listando...' : 'Listar en Marketplace'}
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
