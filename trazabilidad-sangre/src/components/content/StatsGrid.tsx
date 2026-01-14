'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  decimals?: number;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  animationDuration?: number;
}

function CountUp({
  end,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = ''
}: {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / (duration * 1000), 1);

      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = startValue + (endValue - startValue) * eased;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export default function StatsGrid({
  stats,
  columns = 4,
  animationDuration = 2
}: StatsGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} gap-6 w-full`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 text-center"
        >
          {/* Icon */}
          {stat.icon && (
            <div className="flex justify-center mb-4 text-primary-500">
              <div className="text-4xl">{stat.icon}</div>
            </div>
          )}

          {/* Value with CountUp */}
          <div className="text-4xl font-bold text-primary-600 mb-2">
            <CountUp
              end={stat.value}
              duration={animationDuration}
              decimals={stat.decimals || 0}
              prefix={stat.prefix || ''}
              suffix={stat.suffix || ''}
            />
          </div>

          {/* Label */}
          <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
