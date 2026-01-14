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
      solid: 'bg-blue-500 text-white',
      outlined: 'border-2 border-blue-500 text-blue-700',
      soft: 'bg-blue-100 text-blue-700',
    },
  },
  completed: {
    label: 'Completado',
    colors: {
      solid: 'bg-success-600 text-white',
      outlined: 'border-2 border-success-600 text-success-700',
      soft: 'bg-success-100 text-success-700',
    },
  },
  cancelled: {
    label: 'Cancelado',
    colors: {
      solid: 'bg-red-500 text-white',
      outlined: 'border-2 border-red-500 text-red-700',
      soft: 'bg-red-100 text-red-700',
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
          'bg-blue-400': status === 'processing',
          'bg-success-400': status === 'completed',
          'bg-red-400': status === 'cancelled',
          'animate-ping': shouldPulse,
        })}
      />
      {displayText}
    </span>
  );
};

export default Badge;
