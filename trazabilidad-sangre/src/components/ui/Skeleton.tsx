'use client';

import React from 'react';
import clsx from 'clsx';

export type SkeletonVariant = 'card' | 'list' | 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  count = 1,
  className,
}) => {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

  const variantClasses: Record<SkeletonVariant, string> = {
    card: 'rounded-xl p-6 space-y-4',
    list: 'rounded-lg',
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  if (variant === 'card') {
    return (
      <div className={clsx(baseClasses, variantClasses.card, className)} style={{ width, height }}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={clsx(baseClasses, variantClasses.list, 'h-16', className)}
            style={{ width }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={clsx(baseClasses, variantClasses.text, className)}
            style={{ width: width || '100%' }}
          />
        ))}
      </div>
    );
  }

  // Default rect or circle
  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
