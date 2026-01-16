'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center sm:p-12',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 sm:h-20 sm:w-20">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-600 sm:text-base">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            size="md"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
