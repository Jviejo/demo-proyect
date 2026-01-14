'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition component for smooth page navigation animations
 * Uses framer-motion for fade in/out effects
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
