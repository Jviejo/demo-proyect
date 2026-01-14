'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';

interface ImageTextSectionProps {
  title: string;
  description: string | React.ReactNode;
  image: string;
  imagePosition?: 'left' | 'right';
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  features?: string[];
  backgroundColor?: 'white' | 'gray' | 'primary';
  className?: string;
}

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  primary: 'bg-primary-50',
};

export default function ImageTextSection({
  title,
  description,
  image,
  imagePosition = 'left',
  imageAlt,
  ctaText,
  ctaLink,
  onCtaClick,
  features,
  backgroundColor = 'white',
  className = '',
}: ImageTextSectionProps) {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  return (
    <section className={`${backgroundClasses[backgroundColor]} py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'left' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              {title}
            </h2>

            <div className="text-lg text-gray-600 mb-6 leading-relaxed">
              {description}
            </div>

            {/* Features List */}
            {features && features.length > 0 && (
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="inline-block w-6 h-6 mr-3 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-full h-full text-success-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            {ctaText && (
              <Button
                onClick={handleCtaClick}
                variant="primary"
                size="lg"
              >
                {ctaText}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
