'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FaEthereum, FaMapMarkerAlt, FaClock, FaUser, FaCheckCircle } from 'react-icons/fa';
import { truncateAddress, formatEther, formatDateTime, getCompanyName } from '@/lib/helpers';
import clsx from 'clsx';

export interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    tokenId: number;
    tokenAddress: string;
    typeString: string;
    typeNumber: number;
    price: string;
    seller: string;
    image: string;
  } | null;
  onConfirmPurchase?: (tokenId: number, price: string, tokenAddress: string) => Promise<void>;
  isOwnProduct?: boolean;
}

interface TraceEvent {
  event: string;
  timestamp: Date;
  from: string;
  to: string;
}

const derivativeTypeInfo: Record<string, { color: string; description: string }> = {
  BLOOD_BAG: {
    color: 'text-blood-600',
    description: 'Unidad completa de sangre donada lista para procesamiento o transfusión.',
  },
  PLASMA: {
    color: 'text-yellow-600',
    description: 'Componente líquido de la sangre que contiene proteínas y nutrientes esenciales.',
  },
  ERYTHROCYTES: {
    color: 'text-red-600',
    description: 'Glóbulos rojos responsables del transporte de oxígeno en el cuerpo.',
  },
  PLATELETS: {
    color: 'text-blue-600',
    description: 'Células sanguíneas que ayudan en la coagulación de la sangre.',
  },
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirmPurchase,
  isOwnProduct = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerInfo, setSellerInfo] = useState<{ name: string; location: string } | null>(null);
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);

  // Resolver información del seller
  useEffect(() => {
    if (product?.seller) {
      const fetchSellerInfo = async () => {
        try {
          const name = await getCompanyName(product.seller);
          setSellerName(name);
          // En una implementación real, aquí obtendrías la ubicación desde el contrato
          setSellerInfo({
            name,
            location: 'Europa', // Placeholder
          });
        } catch (error) {
          console.error('Error fetching seller info:', error);
          setSellerName(truncateAddress(product.seller));
        }
      };

      fetchSellerInfo();
    }
  }, [product?.seller]);

  // Simular eventos de trazabilidad (en producción vendrían de blockchain)
  useEffect(() => {
    if (product) {
      // Aquí se obtendrían los eventos reales de blockchain
      setTraceEvents([
        {
          event: 'Creación',
          timestamp: new Date(Date.now() - 86400000 * 2),
          from: '0x0000000000000000000000000000000000000000',
          to: product.seller,
        },
        {
          event: 'Listado',
          timestamp: new Date(Date.now() - 86400000),
          from: product.seller,
          to: product.tokenAddress,
        },
      ]);
    }
  }, [product]);

  if (!product) return null;

  const priceEther = formatEther(product.price, 4);
  const typeInfo = derivativeTypeInfo[product.typeString] || {
    color: 'text-gray-600',
    description: 'Derivado sanguíneo',
  };

  // Estimación de gas fees (en una implementación real vendría de web3)
  const estimatedGasFee = '0.0012';
  const totalCost = (parseFloat(priceEther) + parseFloat(estimatedGasFee)).toFixed(4);

  const handlePurchase = async () => {
    if (!onConfirmPurchase) return;

    setIsLoading(true);
    try {
      await onConfirmPurchase(product.tokenId, product.price, product.tokenAddress);
      onClose();
    } catch (error) {
      console.error('Error purchasing product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${product.typeString} #${product.tokenId}`}
      size="lg"
      footer={
        !isOwnProduct && (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">Total a pagar:</p>
              <div className="flex items-center gap-2">
                <FaEthereum className="text-primary-600 text-xl" />
                <span className="text-2xl font-bold text-gray-900">{totalCost}</span>
                <span className="text-sm text-gray-600">ETH</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Incluye {estimatedGasFee} ETH de gas estimado
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handlePurchase} loading={isLoading}>
                Confirmar Compra
              </Button>
            </div>
          </div>
        )
      }
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Procesando transacción...</p>
            <p className="text-sm text-gray-500 mt-2">Por favor confirma en MetaMask</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Imagen y tipo */}
        <div className="flex gap-6">
          <div className="w-1/3">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src={product.image} alt={product.typeString} className="w-full h-auto" />
            </div>
          </div>

          <div className="w-2/3 space-y-4">
            <div>
              <h4 className={clsx('text-2xl font-bold mb-2', typeInfo.color)}>
                {product.typeString}
              </h4>
              <p className="text-gray-600 text-sm">{typeInfo.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Token ID</p>
                <p className="font-mono text-sm font-semibold text-gray-800">
                  #{product.tokenId}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Tipo</p>
                <Badge
                  status="completed"
                  text={product.typeString}
                  variant="soft"
                />
              </div>
            </div>

            {/* Precio */}
            <div className="bg-gradient-to-r from-primary-50 to-success-50 p-4 rounded-lg border border-primary-200">
              <p className="text-sm text-gray-600 mb-2">Precio</p>
              <div className="flex items-center gap-2">
                <FaEthereum className="text-primary-600 text-3xl" />
                <span className="text-4xl font-bold text-gray-900">{priceEther}</span>
                <span className="text-lg text-gray-600 mt-2">ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info del vendedor */}
        <div className="border-t pt-4">
          <h5 className="text-lg font-semibold text-gray-800 mb-3">
            <FaUser className="inline mr-2" />
            Información del Vendedor
          </h5>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nombre:</span>
              <span className="font-medium text-gray-800">{sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dirección:</span>
              <span className="font-mono text-xs text-gray-700" title={product.seller}>
                {truncateAddress(product.seller, 10, 8)}
              </span>
            </div>
            {sellerInfo?.location && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  <FaMapMarkerAlt className="inline mr-1" />
                  Ubicación:
                </span>
                <span className="font-medium text-gray-800">{sellerInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline de trazabilidad condensada */}
        <div className="border-t pt-4">
          <h5 className="text-lg font-semibold text-gray-800 mb-3">
            <FaClock className="inline mr-2" />
            Historial de Trazabilidad
          </h5>
          <div className="space-y-3">
            {traceEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="text-success-600 text-lg" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{event.event}</span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    De: <span className="font-mono">{truncateAddress(event.from)}</span>
                    {' → '}
                    A: <span className="font-mono">{truncateAddress(event.to)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Ver historial completo en la página de trazabilidad
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
