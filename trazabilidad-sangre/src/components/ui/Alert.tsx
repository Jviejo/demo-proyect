'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig = {
  info: {
    container: 'bg-blockchain-50 border-blockchain-200 text-blockchain-900',
    icon: 'text-blockchain-600',
    title: 'text-blockchain-900',
    close: 'text-blockchain-600 hover:text-blockchain-800',
    Icon: InformationCircleIcon,
  },
  success: {
    container: 'bg-medical-50 border-medical-200 text-medical-900',
    icon: 'text-medical-600',
    title: 'text-medical-900',
    close: 'text-medical-600 hover:text-medical-800',
    Icon: CheckCircleIcon,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    close: 'text-yellow-600 hover:text-yellow-800',
    Icon: ExclamationTriangleIcon,
  },
  error: {
    container: 'bg-blood-50 border-blood-200 text-blood-900',
    icon: 'text-blood-600',
    title: 'text-blood-900',
    close: 'text-blood-600 hover:text-blood-800',
    Icon: XCircleIcon,
  },
};

export function Alert({
  variant,
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={clsx(
        'relative rounded-lg border p-4',
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <IconComponent className={clsx('h-5 w-5 flex-shrink-0', config.icon)} />

        <div className="flex-1">
          {title && (
            <h3 className={clsx('mb-1 font-semibold', config.title)}>
              {title}
            </h3>
          )}
          <div className="text-sm">{children}</div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              'flex-shrink-0 rounded-md p-1 transition-colors',
              config.close
            )}
            aria-label="Cerrar alerta"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
