"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface CompanyInfoProps {
  companyName: string;
  location: string;
  registerSanitario: string;
  onFieldChange: (field: string, value: string) => void;
}

interface ValidationErrors {
  companyName?: string;
  location?: string;
  registerSanitario?: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  companyName,
  location,
  registerSanitario,
  onFieldChange,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "companyName":
        if (!value.trim()) return "El nombre de la compañía es requerido";
        if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
        break;
      case "location":
        if (!value.trim()) return "La ubicación es requerida";
        if (value.trim().length < 3) return "La ubicación debe tener al menos 3 caracteres";
        break;
      case "registerSanitario":
        if (!value.trim()) return "El registro sanitario es requerido";
        if (value.trim().length < 5) return "El registro sanitario debe tener al menos 5 caracteres";
        break;
    }
    return undefined;
  };

  const handleChange = (field: string, value: string) => {
    onFieldChange(field, value);

    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Información de la Compañía
        </h3>
        <p className="text-gray-600">
          Completa los datos de tu organización
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Company Name */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre de la Compañía *
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            onBlur={(e) => handleBlur("companyName", e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-200
              ${errors.companyName && touched.companyName
                ? "border-red-300 bg-red-50"
                : "border-gray-300 focus:border-primary-500"
              }
            `}
            placeholder="Ej: Hospital Central de Madrid"
          />
          {errors.companyName && touched.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ubicación *
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => handleChange("location", e.target.value)}
            onBlur={(e) => handleBlur("location", e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-200
              ${errors.location && touched.location
                ? "border-red-300 bg-red-50"
                : "border-gray-300 focus:border-primary-500"
              }
            `}
            placeholder="Ej: Madrid, España"
          />
          {errors.location && touched.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Registro Sanitario */}
        <div>
          <label
            htmlFor="registerSanitario"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Registro Sanitario *
          </label>
          <input
            type="text"
            id="registerSanitario"
            value={registerSanitario}
            onChange={(e) => handleChange("registerSanitario", e.target.value)}
            onBlur={(e) => handleBlur("registerSanitario", e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-200
              ${errors.registerSanitario && touched.registerSanitario
                ? "border-red-300 bg-red-50"
                : "border-gray-300 focus:border-primary-500"
              }
            `}
            placeholder="Ej: RS-2024-001234"
          />
          {errors.registerSanitario && touched.registerSanitario && (
            <p className="mt-1 text-sm text-red-600">{errors.registerSanitario}</p>
          )}
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Información importante
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Estos datos se registrarán en la blockchain y no podrán ser modificados posteriormente.
                Asegúrate de que toda la información sea correcta.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyInfo;
