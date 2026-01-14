'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export type CardVariant = 'default' | 'elevated' | 'outlined';
export type CardState = 'default' | 'loading' | 'error' | 'success';

export interface CardProps {
  variant?: CardVariant;
  state?: CardState;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white shadow-card',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border-2 border-gray-200',
};

const stateClasses: Record<CardState, string> = {
  default: '',
  loading: 'opacity-70 pointer-events-none',
  error: 'border-red-300 bg-red-50',
  success: 'border-success-300 bg-success-50',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  state = 'default',
  header,
  children,
  footer,
  className,
  hoverable = false,
  onClick,
}) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      className={clsx(
        'rounded-xl overflow-hidden transition-all duration-200',
        variantClasses[variant],
        stateClasses[state],
        {
          'cursor-pointer': isClickable,
        },
        className
      )}
      whileHover={
        hoverable || isClickable
          ? {
              scale: 1.02,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }
          : {}
      }
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-800">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>
      )}

      {state === 'error' && (
        <div className="px-6 py-3 bg-red-100 border-t border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Error al cargar los datos
          </p>
        </div>
      )}

      {state === 'success' && (
        <div className="px-6 py-3 bg-success-100 border-t border-success-200">
          <p className="text-sm text-success-700 flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Operación exitosa
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Card;
