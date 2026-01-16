'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  image?: string;
  icon?: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  price?: string;
  index?: number;
}

export default function ServiceCard({
  title,
  description,
  features,
  image,
  icon,
  ctaText = 'Learn More',
  onCtaClick,
  price,
  index = 0
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image or Icon Header */}
      {image ? (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : icon ? (
        <div className="h-32 bg-gradient-to-br from-primary-500 to-success-500 flex items-center justify-center">
          <div className="text-6xl text-white">{icon}</div>
        </div>
      ) : null}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h3>

        {/* Price */}
        {price && (
          <div className="text-3xl font-bold text-primary-600 mb-4">
            {price}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-6 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <svg
                className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={onCtaClick}
          variant="primary"
          className="w-full"
        >
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
}
