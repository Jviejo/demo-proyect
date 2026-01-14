"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountryRegulation {
  country: string;
  flag: string; // Emoji flag
  eligibility: string[];
  process: string[];
  regulations: string[];
}

interface CountryAccordionProps {
  countries: CountryRegulation[];
}

export default function CountryAccordion({ countries }: CountryAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {countries.map((country, index) => (
        <div
          key={country.country}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{country.flag}</span>
              <h3 className="text-lg font-semibold text-gray-800">
                {country.country}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: activeIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Eligibility */}
                    <div>
                      <h4 className="font-semibold text-primary-600 mb-2 flex items-center">
                        <span className="mr-2">✅</span> Elegibilidad
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {country.eligibility.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Process */}
                    <div>
                      <h4 className="font-semibold text-success-600 mb-2 flex items-center">
                        <span className="mr-2">🔄</span> Proceso
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {country.process.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Regulations */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">📋</span> Regulaciones
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {country.regulations.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
