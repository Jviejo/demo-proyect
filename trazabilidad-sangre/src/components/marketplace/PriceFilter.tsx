'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEthereum } from 'react-icons/fa';
import clsx from 'clsx';

export interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  defaultMin?: number;
  defaultMax?: number;
  onChange?: (min: number, max: number) => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice = 0,
  maxPrice = 10,
  defaultMin = 0,
  defaultMax = 10,
  onChange,
  className,
}) => {
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);
  const [isDragging, setIsDragging] = useState(false);

  // Notificar cambios con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(min, max);
    }, 300);

    return () => clearTimeout(timer);
  }, [min, max, onChange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= minPrice && value <= max) {
      setMin(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value <= maxPrice && value >= min) {
      setMax(value);
    }
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value <= max) {
      setMin(value);
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= min) {
      setMax(value);
    }
  };

  const minPercent = ((min - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((max - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <motion.div
      className={clsx('bg-white rounded-xl shadow-card p-6', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaEthereum className="text-primary-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Filtrar por Precio</h3>
        </div>

        {/* Range Slider */}
        <div className="relative mb-8 pt-2">
          <div className="relative h-2 bg-gray-200 rounded-full">
            {/* Active range highlight */}
            <div
              className="absolute h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full transition-all duration-300"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
          </div>

          {/* Min slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={0.01}
            value={min}
            onChange={handleMinSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute w-full h-2 -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
          />

          {/* Max slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={0.01}
            value={max}
            onChange={handleMaxSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute w-full h-2 -top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-success-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-success-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
          />
        </div>

        {/* Min/Max Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Min Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Mínimo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEthereum className="text-gray-400" />
              </div>
              <input
                type="number"
                min={minPrice}
                max={max}
                step={0.01}
                value={min}
                onChange={handleMinChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">ETH</p>
          </div>

          {/* Max Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Máximo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEthereum className="text-gray-400" />
              </div>
              <input
                type="number"
                min={min}
                max={maxPrice}
                step={0.01}
                value={max}
                onChange={handleMaxChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500 transition-colors"
                placeholder="10.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">ETH</p>
          </div>
        </div>

        {/* Range Display */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg border border-primary-200">
          <p className="text-center text-sm text-gray-700">
            Rango seleccionado:{' '}
            <span className="font-semibold text-primary-700">{min.toFixed(2)}</span>
            {' - '}
            <span className="font-semibold text-success-700">{max.toFixed(2)}</span>
            {' ETH'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceFilter;
