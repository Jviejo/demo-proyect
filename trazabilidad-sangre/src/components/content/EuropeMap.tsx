"use client";

import React from "react";
import { motion } from "framer-motion";

interface MapData {
  country: string;
  donations: number;
  color: string;
}

interface EuropeMapProps {
  data: MapData[];
}

export default function EuropeMap({ data }: EuropeMapProps) {
  return (
    <div className="relative w-full bg-white rounded-lg shadow-card p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Donaciones de Sangre en Europa
      </h3>

      {/* Simplified Europe Map with countries */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {data.map((country, index) => (
          <motion.div
            key={country.country}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg border-2 hover:shadow-lg transition-shadow cursor-pointer"
            style={{ borderColor: country.color }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{country.country}</p>
                <p className="text-sm text-gray-600">
                  {country.donations.toLocaleString()} donaciones/año
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: country.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {data.reduce((acc, c) => acc + c.donations, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Donaciones</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{data.length}</p>
            <p className="text-sm text-gray-600">Países</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">94%</p>
            <p className="text-sm text-gray-600">Trazabilidad</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">98%</p>
            <p className="text-sm text-gray-600">Seguridad</p>
          </div>
        </div>
      </div>
    </div>
  );
}
