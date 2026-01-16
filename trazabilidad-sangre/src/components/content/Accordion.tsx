'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccordionItem {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
  className?: string;
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = ''
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpen);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  const isOpen = (index: number) => openIndexes.includes(index);

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-card overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center flex-1">
              {/* Icon */}
              {item.icon && (
                <div className="mr-4 text-2xl text-primary-500">
                  {item.icon}
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isOpen(index) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 text-primary-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {isOpen(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
                  {typeof item.content === 'string' ? (
                    <p>{item.content}</p>
                  ) : (
                    item.content
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
