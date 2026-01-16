'use client';

import { useWallet } from './ConnectWalletButton';
import { useEffect, useState, useCallback } from 'react';
import { abi as abiTracker } from '@/../../src/lib/contracts/BloodTracker';
import { abi as abiDerivative } from '@/../../src/lib/contracts/BloodDerivative';
import { abi as abiDonation } from '@/../../src/lib/contracts/BloodDonation';
import { FaFilter, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { AppContainer } from '@/app/layout';
import { Button } from './ui/Button';
import { ProductCard } from './marketplace/ProductCard';
import { ProductDetailModal } from './marketplace/ProductDetailModal';
import { ListItemModal } from './marketplace/ListItemModal';
import { PriceFilter } from './marketplace/PriceFilter';
import { FilterPanel } from './marketplace/FilterPanel';
import { Skeleton } from './ui/Skeleton';
import Grid from './ui/Grid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';
import { formatEther } from '@/lib/helpers';

export const getDerivativeTypeFromNumber = (derivativeType: number) => {
  switch (derivativeType) {
    case 1:
      return 'PLASMA';
    case 2:
      return 'ERYTHROCYTES';
    case 3:
      return 'PLATELETS';
    default:
      return 'UNKNOWN';
  }
};

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

interface TokenInterface {
  tokenAddress: string;
  tokenId: number;
  typeString: string;
  typeNumber: number;
  price: string;
  priceEther: string;
  seller: string;
  image: string;
  isBloodBag: boolean;  // true = BloodDonation, false = BloodDerivative
}

function Marketplace() {
  const { account, web3 } = useWallet();
  const [filterType, setFilterType] = useState<number>(0);
  const [tokensOnSale, setTokensOnSale] = useState<TokenInterface[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<TokenInterface | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10 });

  const tokenAddresses = [
    process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS
  ];

  const marketPlaceTypes = [
    { id: 0, label: 'Todos' },
    { id: -1, label: 'Bolsa Completa' },
    { id: 1, label: 'Plasma' },
    { id: 2, label: 'Eritrocitos' },
    { id: 3, label: 'Plaquetas' },
  ];

  // Función para obtener tokens en venta
  const fetchTokensOnSale = useCallback(async () => {
    if (!web3 || !account) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const tokens: TokenInterface[] = [];

      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      for (const address of tokenAddresses) {
        const result = await contractTracker.methods.getTokensOnSale(address).call({ from: account });

        for (const tokenId of result) {
          const isBloodDonation = address === process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS;

          let typeString, typeNumber, image;

          if (isBloodDonation) {
            // Es BloodDonation - bolsa completa
            typeString = 'BLOOD_BAG';
            typeNumber = 0;
            image = '/blood-bag.png';
          } else {
            // Es BloodDerivative
            const contract = new web3.eth.Contract(
              abiDerivative,
              process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS
            );

            // Obtener el tipo de derivado del contrato
            const product = await contract.methods.products(tokenId).call();
            const derivativeType = Number(product.derivative);

            typeString = getDerivativeTypeFromNumber(derivativeType);
            typeNumber = derivativeType;
            image = getImageFromDerivative(derivativeType);
          }

          const marketplaceData = await contractTracker.methods
            .getListing(address, tokenId)
            .call({ from: account });

          tokens.push({
            tokenAddress: address!,
            tokenId: Number(tokenId),
            typeString,
            typeNumber,
            price: marketplaceData[0].toString(),
            priceEther: formatEther(marketplaceData[0].toString()),
            seller: marketplaceData[1].toString(),
            image,
            isBloodBag: isBloodDonation,
          });
        }
      }

      setTokensOnSale(tokens);
    } catch (error) {
      console.error('Error fetching tokens on sale:', error);
      showTransactionError(error);
    } finally {
      setIsLoading(false);
    }
  }, [web3, account]);

  // Cargar tokens al montar y cuando cambien dependencias
  useEffect(() => {
    fetchTokensOnSale();
  }, [fetchTokensOnSale]);

  // Filtrar tokens por tipo y precio
  useEffect(() => {
    let filtered = tokensOnSale;

    // Filtro por tipo
    if (filterType !== 0) {
      if (filterType === -1) {
        // Filtrar solo bolsas completas
        filtered = filtered.filter((token) => token.isBloodBag);
      } else {
        // Filtrar por tipo de derivado
        filtered = filtered.filter((token) => !token.isBloodBag && token.typeNumber === filterType);
      }
    }

    // Filtro por precio
    filtered = filtered.filter((token) => {
      const price = parseFloat(token.priceEther);
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredTokens(filtered);
  }, [tokensOnSale, filterType, priceRange]);

  // Función para comprar
  const handleBuyClick = async (tokenId: number, price: string, tokenAddress: string) => {
    if (!web3) return;

    const toastId = showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const tx = await contractTracker.methods
        .buyItem(tokenAddress, tokenId)
        .send({
          value: price,
          from: account,
          gas: '1000000',
          gasPrice: 1000000000,
        });

      showTransactionSuccess(tx.transactionHash);

      // Refrescar lista sin reload
      await fetchTokensOnSale();
    } catch (error) {
      console.error('Error buying item:', error);
      showTransactionError(error);
    }
  };

  // Función para cancelar
  const handleCancelClick = async (tokenId: number, tokenAddress: string) => {
    if (!web3) return;

    const toastId = showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const tx = await contractTracker.methods
        .cancelListing(tokenAddress, tokenId)
        .send({
          from: account,
          gas: '1000000',
          gasPrice: 1000000000,
        });

      showTransactionSuccess(tx.transactionHash);

      // Refrescar lista sin reload
      await fetchTokensOnSale();
    } catch (error) {
      console.error('Error canceling listing:', error);
      showTransactionError(error);
    }
  };

  // Función para ver detalles
  const handleDetailsClick = (tokenId: number) => {
    const product = filteredTokens.find((t) => t.tokenId === tokenId);
    if (product) {
      setSelectedProduct(product);
      setIsDetailModalOpen(true);
    }
  };

  // Verificar si el usuario es el vendedor
  const isSeller = (seller: string) => {
    if (!web3 || !account) return false;
    return (
      web3.utils.toChecksumAddress(seller) === web3.utils.toChecksumAddress(account)
    );
  };

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              HeroChain Marketplace
            </h1>
            <p className="text-lg text-slate-600">
              Compra y vende derivados sanguíneos de forma segura en blockchain
            </p>
          </div>

          {/* Layout con sidebar en desktop */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar de filtros - Solo desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-8">
                <FilterPanel
                  filterType={filterType}
                  setFilterType={setFilterType}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  marketPlaceTypes={marketPlaceTypes}
                />
              </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1">
              {/* Botón de filtros móvil */}
              <div className="lg:hidden mb-6">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowFilters(true)}
                  className="w-full"
                >
                  <FaFilter className="mr-2" />
                  Mostrar Filtros
                </Button>
              </div>

              {/* Resultados */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-slate-600">
                  {isLoading ? (
                    'Cargando productos...'
                  ) : (
                    <>
                      {filteredTokens.length} producto{filteredTokens.length !== 1 ? 's' : ''}{' '}
                      encontrado{filteredTokens.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>

          {/* Grid de productos */}
          {isLoading ? (
            <Grid cols={{ xs: 1, md: 2, lg: 3, xl: 4 }} gap="md">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </Grid>
          ) : filteredTokens.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-slate-100 rounded-full mb-6">
                <svg
                  className="w-24 h-24 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-slate-500 mb-6">
                {filterType === 0
                  ? 'Aún no hay productos en venta en el marketplace'
                  : 'No se encontraron productos con los filtros seleccionados'}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsListItemModalOpen(true)}
              >
                <FaPlus className="mr-2" />
                Listar Producto
              </Button>
            </div>
          ) : (
            <Grid cols={{ xs: 1, md: 2, lg: 3, xl: 4 }} gap="md">
              {/* Card para agregar item */}
              <div
                onClick={() => setIsListItemModalOpen(true)}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-primary-500"
              >
                <div className="bg-primary-50 rounded-full p-6 mb-4">
                  <FaPlus className="text-4xl text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-700 mb-2">
                  Agregar Producto
                </h4>
                <p className="text-sm text-slate-500 text-center">
                  Lista tus derivados en el marketplace
                </p>
              </div>

              {/* Cards de productos */}
              {filteredTokens.map((token) => (
                <ProductCard
                  key={`${token.tokenAddress}-${token.tokenId}`}
                  tokenId={token.tokenId}
                  tokenAddress={token.tokenAddress}
                  typeString={token.typeString}
                  typeNumber={token.typeNumber}
                  price={token.price}
                  seller={token.seller}
                  image={token.image}
                  onBuy={handleBuyClick}
                  onDetails={handleDetailsClick}
                  onCancel={handleCancelClick}
                  isSeller={isSeller(token.seller)}
                />
              ))}
            </Grid>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de filtros móvil */}
      <Transition appear show={showFilters} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => setShowFilters(false)}
        >
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
            <div className="flex min-h-full items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl shadow-xl transition-all">
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                    <Dialog.Title className="text-lg font-semibold text-slate-900">
                      Filtros
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowFilters(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <FilterPanel
                      filterType={filterType}
                      setFilterType={setFilterType}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      marketPlaceTypes={marketPlaceTypes}
                    />
                    <div className="mt-6">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setShowFilters(false)}
                        className="w-full"
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de detalles */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirmPurchase={handleBuyClick}
        isOwnProduct={selectedProduct ? isSeller(selectedProduct.seller) : false}
      />

      {/* Modal para listar producto */}
      <ListItemModal
        isOpen={isListItemModalOpen}
        onClose={() => setIsListItemModalOpen(false)}
        onSuccess={fetchTokensOnSale}
      />
    </AppContainer>
  );
}

export default Marketplace;
