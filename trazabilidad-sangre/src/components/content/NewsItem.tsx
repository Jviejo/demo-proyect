'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Badge from '../ui/Badge';

interface NewsItemProps {
  title: string;
  description: string;
  date: string;
  category: 'update' | 'regulatory' | 'partnership' | 'event';
  image?: string;
  link?: string;
  index?: number;
}

const categoryConfig = {
  update: { label: 'Actualización', color: 'bg-blue-500' },
  regulatory: { label: 'Normativa', color: 'bg-purple-500' },
  partnership: { label: 'Partnership', color: 'bg-green-500' },
  event: { label: 'Evento', color: 'bg-orange-500' },
};

export default function NewsItem({
  title,
  description,
  date,
  category,
  image,
  link,
  index = 0
}: NewsItemProps) {
  const categoryInfo = categoryConfig[category];

  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-6 ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="flex gap-6">
        {/* Date Badge */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex flex-col items-center justify-center text-white shadow-md">
            <span className="text-xs font-semibold">
              {new Date(date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
            </span>
            <span className="text-2xl font-bold">
              {new Date(date).getDate()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          {/* Category Badge */}
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 ${categoryInfo.color} text-white text-xs font-semibold rounded-full`}>
              {categoryInfo.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Optional Image */}
        {image && (
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
