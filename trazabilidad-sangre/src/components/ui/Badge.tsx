'use client';

import React from 'react';
import clsx from 'clsx';

export type BadgeStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type BadgeVariant = 'solid' | 'outlined' | 'soft';

export interface BadgeProps {
  status: BadgeStatus;
  variant?: BadgeVariant;
  text?: string;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<BadgeStatus, { label: string; colors: Record<BadgeVariant, string> }> = {
  pending: {
    label: 'Pendiente',
    colors: {
      solid: 'bg-yellow-500 text-white',
      outlined: 'border-2 border-yellow-500 text-yellow-700',
      soft: 'bg-yellow-100 text-yellow-700',
    },
  },
  processing: {
    label: 'En Proceso',
    colors: {
      solid: 'bg-blockchain-600 text-white',
      outlined: 'border-2 border-blockchain-600 text-blockchain-700',
      soft: 'bg-blockchain-100 text-blockchain-700',
    },
  },
  completed: {
    label: 'Completado',
    colors: {
      solid: 'bg-medical-600 text-white',
      outlined: 'border-2 border-medical-600 text-medical-700',
      soft: 'bg-medical-100 text-medical-700',
    },
  },
  cancelled: {
    label: 'Cancelado',
    colors: {
      solid: 'bg-blood-600 text-white',
      outlined: 'border-2 border-blood-600 text-blood-700',
      soft: 'bg-blood-100 text-blood-700',
    },
  },
};

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant = 'soft',
  text,
  pulse = false,
  className,
}) => {
  const config = statusConfig[status];
  const displayText = text || config.label;
  const shouldPulse = pulse && status === 'processing';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        config.colors[variant],
        {
          'animate-pulse': shouldPulse,
        },
        className
      )}
    >
      {/* Status indicator dot */}
      <span
        className={clsx('w-2 h-2 rounded-full', {
          'bg-yellow-400': status === 'pending',
          'bg-blockchain-400': status === 'processing',
          'bg-medical-400': status === 'completed',
          'bg-blood-400': status === 'cancelled',
          'animate-ping': shouldPulse,
        })}
      />
      {displayText}
    </span>
  );
};

export default Badge;
