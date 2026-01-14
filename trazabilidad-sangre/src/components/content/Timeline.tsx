'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-success-500" />

      {/* Timeline Items */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-16"
          >
            {/* Icon Circle */}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-primary-500 shadow-lg flex items-center justify-center text-white z-10">
              {item.icon || (
                <span className="text-lg font-bold">{index + 1}</span>
              )}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6">
              {/* Date */}
              {item.date && (
                <div className="text-sm text-primary-600 font-semibold mb-2">
                  {item.date}
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
