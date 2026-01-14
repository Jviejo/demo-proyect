import React from 'react';
import clsx from 'clsx';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: 1 | 2 | 3 | 4 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  const getColClass = (breakpoint: string, numCols?: number) => {
    if (!numCols) return '';
    const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
    return `${prefix}grid-cols-${numCols}`;
  };

  const colClasses = [
    getColClass('xs', cols.xs),
    getColClass('sm', cols.sm),
    getColClass('md', cols.md),
    getColClass('lg', cols.lg),
    getColClass('xl', cols.xl),
    getColClass('2xl', cols['2xl']),
  ].filter(Boolean).join(' ');

  return (
    <div
      className={clsx(
        'grid',
        colClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
