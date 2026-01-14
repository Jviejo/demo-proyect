'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LocationCardProps {
  city: string;
  country: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  image?: string;
  mapLink?: string;
  index?: number;
}

export default function LocationCard({
  city,
  country,
  address,
  phone,
  email,
  hours,
  image,
  mapLink,
  index = 0
}: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={`${city}, ${country}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{city}</h3>
            <p className="text-sm">{country}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="text-primary-500 mt-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Dirección</p>
            <p className="text-gray-700">{address}</p>
          </div>
        </div>

        {/* Phone */}
        {phone && (
          <div className="flex items-start gap-3">
            <div className="text-primary-500 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Teléfono</p>
              <a href={`tel:${phone}`} className="text-gray-700 hover:text-primary-600 transition-colors">
                {phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-start gap-3">
            <div className="text-primary-500 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Email</p>
              <a href={`mailto:${email}`} className="text-gray-700 hover:text-primary-600 transition-colors">
                {email}
              </a>
            </div>
          </div>
        )}

        {/* Hours */}
        {hours && (
          <div className="flex items-start gap-3">
            <div className="text-primary-500 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Horario</p>
              <p className="text-gray-700">{hours}</p>
            </div>
          </div>
        )}

        {/* Map Link */}
        {mapLink && (
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Ver en Mapa
          </a>
        )}
      </div>
    </motion.div>
  );
}
