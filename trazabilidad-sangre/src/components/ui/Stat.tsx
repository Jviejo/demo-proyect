'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface TrendData {
  value: number;
  direction: 'up' | 'down';
}

interface StatProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  trend?: TrendData;
  color?: 'blood' | 'blockchain' | 'medical' | 'gray';
  className?: string;
}

const colorClasses = {
  blood: {
    bg: 'bg-blood-50',
    icon: 'text-blood-600',
    border: 'border-blood-200',
  },
  blockchain: {
    bg: 'bg-blockchain-50',
    icon: 'text-blockchain-600',
    border: 'border-blockchain-200',
  },
  medical: {
    bg: 'bg-medical-50',
    icon: 'text-medical-600',
    border: 'border-medical-200',
  },
  gray: {
    bg: 'bg-slate-50',
    icon: 'text-slate-600',
    border: 'border-slate-200',
  },
};

export function Stat({
  icon,
  label,
  value,
  trend,
  color = 'gray',
  className,
}: StatProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={clsx(
        'rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        colors.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.direction === 'up' ? (
                <ArrowUpIcon className="h-4 w-4 text-medical-600" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-blood-600" />
              )}
              <span
                className={clsx(
                  'text-sm font-medium',
                  trend.direction === 'up' ? 'text-medical-600' : 'text-blood-600'
                )}
              >
                {trend.value}%
              </span>
              <span className="text-sm text-slate-500">vs. anterior</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className={clsx(
              'rounded-lg p-3',
              colors.bg,
              colors.icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
