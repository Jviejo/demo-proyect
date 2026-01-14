'use client';

import { useWallet } from './ConnectWalletButton';
import { useEffect, useState, useCallback } from 'react';
import { abi as abiTracker } from '@/../../src/lib/contracts/BloodTracker';
import { abi as abiDerivative } from '@/../../src/lib/contracts/BloodDerivative';
import { FaFilter, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { AppContainer } from '@/app/layout';
import { Button } from './ui/Button';
import { ProductCard } from './marketplace/ProductCard';
import { ProductDetailModal } from './marketplace/ProductDetailModal';
import { PriceFilter } from './marketplace/PriceFilter';
import { Skeleton } from './ui/Skeleton';
import { showTransactionSuccess, showTransactionError, showTransactionPending } from '@/lib/toast';

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
}

function Marketplace() {
  const { account, web3 } = useWallet();
  const [filterType, setFilterType] = useState<number>(0);
  const [tokensOnSale, setTokensOnSale] = useState<TokenInterface[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<TokenInterface | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10 });

  const tokenAddresses = [process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS];

  const marketPlaceTypes = [
    { id: 0, label: 'Todos' },
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

      for (const address of tokenAddresses) {
        const contractTracker = new web3.eth.Contract(
          abiTracker,
          process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
        );
        const result = await contractTracker.methods.getTokensOnSale(address).call({ from: account });

        for (const tokenId of result) {
          const contract = new web3.eth.Contract(
            abiDerivative,
            process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS
          );

          // FIX línea 87: Obtener correctamente el tipo de derivado
          const product = await contract.methods.products(tokenId).call();
          const derivativeType = Number(product.derivativeType); // Corregido

          const marketplaceData = await contractTracker.methods
            .getListing(address, tokenId)
            .call({ from: account });

          tokens.push({
            tokenAddress: process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS!,
            tokenId: Number(tokenId),
            typeString: getDerivativeTypeFromNumber(derivativeType),
            typeNumber: derivativeType,
            price: marketplaceData[0].toString(),
            priceEther: web3.utils.fromWei(Number(marketplaceData[0]), 'ether'),
            seller: marketplaceData[1].toString(),
            image: getImageFromDerivative(derivativeType),
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
      filtered = filtered.filter((token) => token.typeNumber === filterType);
    }

    // Filtro por precio
    filtered = filtered.filter((token) => {
      const price = parseFloat(token.priceEther);
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredTokens(filtered);
  }, [tokensOnSale, filterType, priceRange]);

  // Función para comprar
  const handleBuyClick = async (tokenId: number, price: string) => {
    if (!web3) return;

    const toastId = showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const tx = await contractTracker.methods
        .buyItem(process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS, tokenId)
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
  const handleCancelClick = async (tokenId: number) => {
    if (!web3) return;

    const toastId = showTransactionPending();

    try {
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const tx = await contractTracker.methods
        .cancelListing(process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS, tokenId)
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              HeroChain Marketplace
            </h1>
            <p className="text-lg text-gray-600">
              Compra y vende derivados sanguíneos de forma segura en blockchain
            </p>
          </div>

          {/* Filtros de tipo */}
          <div className="flex flex-wrap gap-3 mb-6">
            {marketPlaceTypes.map((type) => (
              <Button
                key={type.id}
                variant={filterType === type.id ? 'primary' : 'ghost'}
                size="md"
                onClick={() => setFilterType(type.id)}
              >
                {type.label}
              </Button>
            ))}

            {/* Toggle filtros avanzados */}
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Ocultar Filtros' : 'Más Filtros'}
            </Button>
          </div>

          {/* Filtro de precio */}
          {showFilters && (
            <div className="mb-6">
              <PriceFilter
                minPrice={0}
                maxPrice={10}
                defaultMin={priceRange.min}
                defaultMax={priceRange.max}
                onChange={(min, max) => setPriceRange({ min, max })}
              />
            </div>
          )}

          {/* Resultados */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          ) : filteredTokens.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
                <svg
                  className="w-24 h-24 text-gray-400"
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
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-500 mb-6">
                {filterType === 0
                  ? 'Aún no hay productos en venta en el marketplace'
                  : 'No se encontraron productos con los filtros seleccionados'}
              </p>
              <Link href="/marketplace/derivative/listItem">
                <Button variant="primary" size="lg">
                  <FaPlus className="mr-2" />
                  Listar Producto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Card para agregar item */}
              <Link href="/marketplace/derivative/listItem" className="block">
                <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 hover:border-primary-500">
                  <div className="bg-primary-50 rounded-full p-6 mb-4">
                    <FaPlus className="text-4xl text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Agregar Producto
                  </h4>
                  <p className="text-sm text-gray-500 text-center">
                    Lista tus derivados en el marketplace
                  </p>
                </div>
              </Link>

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
            </div>
          )}
        </div>
      </div>

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
    </AppContainer>
  );
}

export default Marketplace;
