'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '../ui/Button';

interface WebinarCardProps {
  title: string;
  description: string;
  speaker: string;
  speakerRole?: string;
  date: string; // ISO date string
  duration?: string;
  image?: string;
  isUpcoming?: boolean;
  registrationLink?: string;
  recordingLink?: string;
  index?: number;
}

export default function WebinarCard({
  title,
  description,
  speaker,
  speakerRole,
  date,
  duration = '60 min',
  image,
  isUpcoming = true,
  registrationLink,
  recordingLink,
  index = 0
}: WebinarCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isUpcoming) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventDate = new Date(date).getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        setTimeLeft('En vivo');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [date, isUpcoming]);

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image/Thumbnail */}
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {isUpcoming ? (
              <div className="px-3 py-1 bg-success-500 text-white text-xs font-semibold rounded-full animate-pulse">
                Próximamente
              </div>
            ) : (
              <div className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
                Grabación disponible
              </div>
            )}
          </div>

          {/* Countdown */}
          {isUpcoming && timeLeft && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-lg backdrop-blur-sm">
              ⏱ {timeLeft}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Date & Duration */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>

        {/* Speaker */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-bold">
            {speaker.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{speaker}</p>
            {speakerRole && (
              <p className="text-xs text-gray-500">{speakerRole}</p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        {isUpcoming && registrationLink ? (
          <Button
            onClick={() => window.location.href = registrationLink}
            variant="primary"
            className="w-full"
          >
            Registrarse
          </Button>
        ) : recordingLink ? (
          <Button
            onClick={() => window.location.href = recordingLink}
            variant="secondary"
            className="w-full"
          >
            Ver Grabación
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
