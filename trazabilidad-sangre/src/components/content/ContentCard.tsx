'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ContentCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  imagePosition?: 'top' | 'left' | 'right';
  className?: string;
}

const variantClasses = {
  default: 'bg-white shadow-card hover:shadow-card-hover',
  elevated: 'bg-white shadow-lg hover:shadow-xl',
  outlined: 'bg-white border-2 border-gray-200 hover:border-primary-300',
};

export default function ContentCard({
  title,
  description,
  image,
  icon,
  variant = 'default',
  imagePosition = 'top',
  className = '',
}: ContentCardProps) {
  const isHorizontal = imagePosition === 'left' || imagePosition === 'right';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`${variantClasses[variant]} rounded-lg overflow-hidden transition-all duration-300 ${className}`}
    >
      <div className={`${isHorizontal ? 'flex flex-col md:flex-row' : ''} ${imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Image Section */}
        {image && (
          <div className={`relative ${isHorizontal ? 'md:w-1/2' : 'w-full'} ${imagePosition === 'top' ? 'h-48' : 'h-64'}`}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Content Section */}
        <div className={`p-6 ${isHorizontal ? 'md:w-1/2' : ''} flex flex-col justify-center`}>
          {/* Icon */}
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 text-primary-600">
              <div className="text-2xl">{icon}</div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
