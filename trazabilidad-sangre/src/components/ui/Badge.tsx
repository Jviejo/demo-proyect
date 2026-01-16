'use client';

import React from 'react';
import clsx from 'clsx';

export type BadgeStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type BadgeColor = 'success' | 'info' | 'warning' | 'danger' | 'default';
export type BadgeStyle = 'solid' | 'outlined' | 'soft';

export interface BadgeProps {
  status?: BadgeStatus;
  variant?: BadgeColor;
  style?: BadgeStyle;
  text?: string;
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const statusConfig: Record<BadgeStatus, { label: string; colors: Record<BadgeStyle, string> }> = {
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

const variantConfig: Record<BadgeColor, Record<BadgeStyle, string>> = {
  success: {
    solid: 'bg-green-500 text-white',
    outlined: 'border-2 border-green-500 text-green-700',
    soft: 'bg-green-100 text-green-700',
  },
  info: {
    solid: 'bg-blue-500 text-white',
    outlined: 'border-2 border-blue-500 text-blue-700',
    soft: 'bg-blue-100 text-blue-700',
  },
  warning: {
    solid: 'bg-yellow-500 text-white',
    outlined: 'border-2 border-yellow-500 text-yellow-700',
    soft: 'bg-yellow-100 text-yellow-700',
  },
  danger: {
    solid: 'bg-red-500 text-white',
    outlined: 'border-2 border-red-500 text-red-700',
    soft: 'bg-red-100 text-red-700',
  },
  default: {
    solid: 'bg-slate-500 text-white',
    outlined: 'border-2 border-slate-500 text-slate-700',
    soft: 'bg-slate-100 text-slate-700',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  style = 'soft',
  text,
  pulse = false,
  className,
  children,
  onClick,
}) => {
  let colorClasses: string;
  let displayText: string | React.ReactNode;
  let showDot = false;

  if (status) {
    // Modo status (con dot)
    const config = statusConfig[status];
    colorClasses = config?.colors[style] || '';
    displayText = text || config?.label || '';
    showDot = true;
  } else if (variant) {
    // Modo variant (sin dot)
    colorClasses = variantConfig[variant]?.[style] || '';
    displayText = children || text || '';
  } else {
    // Fallback
    colorClasses = variantConfig.default[style];
    displayText = children || text || '';
  }

  const shouldPulse = pulse && status === 'processing';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        colorClasses,
        {
          'animate-pulse': shouldPulse,
        },
        className
      )}
      onClick={onClick}
    >
      {/* Status indicator dot - solo para status */}
      {showDot && (
        <span
          className={clsx('w-2 h-2 rounded-full', {
            'bg-yellow-400': status === 'pending',
            'bg-blockchain-400': status === 'processing',
            'bg-medical-400': status === 'completed',
            'bg-blood-400': status === 'cancelled',
            'animate-ping': shouldPulse,
          })}
        />
      )}
      {displayText}
    </span>
  );
};

export default Badge;
