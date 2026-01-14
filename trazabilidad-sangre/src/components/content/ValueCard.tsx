'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  reversed?: boolean;
  index?: number;
}

export default function ValueCard({
  title,
  description,
  icon,
  image,
  reversed = false,
  index = 0
}: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden`}
    >
      {/* Image Section */}
      {image && (
        <div className="relative w-full lg:w-1/2 h-64 lg:h-80">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Content Section */}
      <div className={`${image ? 'lg:w-1/2' : 'w-full'} p-8`}>
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary-500 to-success-500 text-white shadow-lg">
          <div className="text-3xl">{icon}</div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
