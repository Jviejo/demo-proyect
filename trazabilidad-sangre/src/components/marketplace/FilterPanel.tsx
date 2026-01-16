'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { PriceFilter } from './PriceFilter';
import { FaFilter } from 'react-icons/fa';
import clsx from 'clsx';

interface MarketplaceType {
  id: number;
  label: string;
}

interface FilterPanelProps {
  filterType: number;
  setFilterType: (type: number) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  marketPlaceTypes: MarketplaceType[];
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterType,
  setFilterType,
  priceRange,
  setPriceRange,
  marketPlaceTypes,
  className,
}) => {
  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blockchain-600 text-xl" />
        <h3 className="text-lg font-semibold text-slate-800">Filtros</h3>
      </div>

      {/* Tipo de derivado */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Tipo de Derivado</h4>
        <div className="space-y-2">
          {marketPlaceTypes?.map((type) => (
            type && (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={clsx(
                  'w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200',
                  'text-sm font-medium',
                  filterType === type.id
                    ? 'bg-blockchain-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                )}
              >
                {type.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Filtro de precio */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Rango de Precio</h4>
        <PriceFilter
          minPrice={0}
          maxPrice={10}
          defaultMin={priceRange.min}
          defaultMax={priceRange.max}
          onChange={(min, max) => setPriceRange({ min, max })}
          className="shadow-sm"
        />
      </div>

      {/* Botón de reset (opcional) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setFilterType(0);
          setPriceRange({ min: 0, max: 10 });
        }}
        className="w-full"
      >
        Restablecer Filtros
      </Button>
    </div>
  );
};

export default FilterPanel;
