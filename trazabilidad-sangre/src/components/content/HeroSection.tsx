'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  overlayOpacity?: number;
}

const heightClasses = {
  sm: 'h-[300px]',
  md: 'h-[400px]',
  lg: 'h-[500px]',
  xl: 'h-[600px]',
};

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
  onCtaClick,
  height = 'lg',
  overlayOpacity = 0.6,
}: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  return (
    <div className={`relative ${heightClasses[height]} overflow-hidden`}>
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <motion.div
          style={{ y }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </motion.div>
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blood-600/80 via-blockchain-600/70 to-medical-500/60"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl drop-shadow-lg"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow-md"
          >
            {subtitle}
          </motion.p>
        )}

        {ctaText && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCtaClick}
            className="px-8 py-3 bg-white text-blood-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-medical-50"
          >
            {ctaText}
          </motion.button>
        )}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
