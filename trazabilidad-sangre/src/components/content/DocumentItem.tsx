'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DocumentItemProps {
  title: string;
  description?: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'other';
  size?: string;
  date?: string;
  downloadLink?: string;
  onDownload?: () => void;
  index?: number;
}

const typeConfig = {
  pdf: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  doc: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  xls: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  ppt: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  other: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
};

export default function DocumentItem({
  title,
  description,
  type,
  size,
  date,
  downloadLink,
  onDownload,
  index = 0
}: DocumentItemProps) {
  const config = typeConfig[type];

  const handleClick = () => {
    if (onDownload) {
      onDownload();
    } else if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-4 cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`${config.bgColor} ${config.color} p-3 rounded-lg flex-shrink-0`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {/* Title */}
          <h4 className="text-base font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors truncate">
            {title}
          </h4>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {type && (
              <span className="uppercase font-semibold">{type}</span>
            )}
            {size && (
              <>
                <span>•</span>
                <span>{size}</span>
              </>
            )}
            {date && (
              <>
                <span>•</span>
                <span>{date}</span>
              </>
            )}
          </div>
        </div>

        {/* Download Icon */}
        <div className="text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
