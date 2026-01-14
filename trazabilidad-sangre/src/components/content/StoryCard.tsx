'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';

interface StoryCardProps {
  title: string;
  excerpt: string;
  image: string;
  date?: string;
  author?: string;
  category?: string;
  readTime?: string;
  onReadMore?: () => void;
  index?: number;
}

export default function StoryCard({
  title,
  excerpt,
  image,
  date,
  author,
  category,
  readTime,
  onReadMore,
  index = 0
}: StoryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full group"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {date && <span>{date}</span>}
          {author && (
            <>
              <span>•</span>
              <span>{author}</span>
            </>
          )}
          {readTime && (
            <>
              <span>•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
          {excerpt}
        </p>

        {/* Read More Button */}
        <Button
          onClick={onReadMore}
          variant="ghost"
          size="sm"
          className="self-start"
        >
          Leer más →
        </Button>
      </div>
    </motion.article>
  );
}
