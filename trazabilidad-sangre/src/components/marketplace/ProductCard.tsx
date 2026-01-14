'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaEthereum } from 'react-icons/fa';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { truncateAddress, formatEther, getCompanyName } from '@/lib/helpers';

export interface ProductCardProps {
  tokenId: number;
  tokenAddress: string;
  typeString: string;
  typeNumber: number;
  price: string;
  seller: string;
  image: string;
  onBuy?: (tokenId: number, price: string) => void;
  onDetails?: (tokenId: number) => void;
  isSeller?: boolean;
  onCancel?: (tokenId: number) => void;
}

const derivativeTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  PLASMA: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  ERYTHROCYTES: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
  },
  PLATELETS: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
};

export const ProductCard: React.FC<ProductCardProps> = ({
  tokenId,
  tokenAddress,
  typeString,
  typeNumber,
  price,
  seller,
  image,
  onBuy,
  onDetails,
  isSeller = false,
  onCancel,
}) => {
  const [sellerName, setSellerName] = useState<string>(truncateAddress(seller));
  const [isLoadingName, setIsLoadingName] = useState(true);

  // Resolver nombre de compañía
  useEffect(() => {
    const fetchSellerName = async () => {
      try {
        const name = await getCompanyName(seller);
        setSellerName(name);
      } catch (error) {
        console.error('Error fetching seller name:', error);
        setSellerName(truncateAddress(seller));
      } finally {
        setIsLoadingName(false);
      }
    };

    fetchSellerName();
  }, [seller]);

  const priceEther = formatEther(price, 4);
  const typeColor = derivativeTypeColors[typeString] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  };

  return (
    <Card variant="elevated" hoverable className="relative">
      {/* Badge de tipo de derivado */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={clsx(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2',
            typeColor.bg,
            typeColor.text,
            typeColor.border
          )}
        >
          {typeString}
        </span>
      </div>

      {/* Imagen del producto */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={`${typeString} ${tokenId}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Información del producto */}
      <div className="p-5 space-y-3">
        {/* Título */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {typeString} #{tokenId}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Token ID: {tokenId}
          </p>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Vendedor:</span>
          <span className="font-medium text-gray-700" title={seller}>
            {isLoadingName ? (
              <span className="animate-pulse bg-gray-200 rounded px-2 py-1">
                Cargando...
              </span>
            ) : (
              sellerName
            )}
          </span>
        </div>

        {/* Precio destacado */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-4 border border-primary-200">
          <FaEthereum className="text-primary-600 text-2xl" />
          <span className="text-3xl font-bold text-gray-900">{priceEther}</span>
          <span className="text-sm text-gray-600 mt-2">ETH</span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          {isSeller ? (
            <>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                onClick={() => onCancel?.(tokenId)}
              >
                Cancelar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => onDetails?.(tokenId)}
              >
                Detalles
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="success"
                size="sm"
                fullWidth
                onClick={() => onBuy?.(tokenId, price)}
              >
                Comprar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => onDetails?.(tokenId)}
              >
                Detalles
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
