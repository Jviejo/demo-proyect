"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface CompanyInfoProps {
  companyRole: string;
  companyName: string;
  location: string;
  registerSanitario: string;
  onFieldChange: (field: string, value: string) => void;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

// Configuración de campos por rol
const roleFieldsConfig: Record<string, {
  title: string;
  subtitle: string;
  fields: Array<{
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'number' | 'select';
    required: boolean;
    minLength?: number;
    options?: string[];
    description?: string;
  }>;
}> = {
  "Collector Center": {
    title: "Información del Centro de Recolección",
    subtitle: "Datos sobre tu centro de donaciones",
    fields: [
      {
        id: "companyName",
        label: "Nombre del Centro",
        placeholder: "Ej: Centro de Donaciones Cruz Roja Madrid",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "location",
        label: "Ubicación",
        placeholder: "Ej: Calle Mayor 123, Madrid, España",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "registerSanitario",
        label: "Registro Sanitario",
        placeholder: "Ej: RS-CDC-2024-001234",
        type: "text",
        required: true,
        minLength: 5,
        description: "Número oficial de registro sanitario del centro"
      },
    ],
  },
  "Laboratory": {
    title: "Información del Laboratorio",
    subtitle: "Datos sobre tu laboratorio de procesamiento",
    fields: [
      {
        id: "companyName",
        label: "Nombre del Laboratorio",
        placeholder: "Ej: Laboratorio BioPharma S.A.",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "location",
        label: "Ubicación de las Instalaciones",
        placeholder: "Ej: Polígono Industrial Norte, Barcelona, España",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "registerSanitario",
        label: "Certificación Sanitaria",
        placeholder: "Ej: LAB-ISO-2024-5678",
        type: "text",
        required: true,
        minLength: 5,
        description: "Número de certificación ISO o registro sanitario"
      },
    ],
  },
  "Trader": {
    title: "Información del Distribuidor",
    subtitle: "Datos sobre tu empresa de distribución",
    fields: [
      {
        id: "companyName",
        label: "Nombre de la Empresa",
        placeholder: "Ej: MedDistribution Logistics S.L.",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "location",
        label: "Sede Central",
        placeholder: "Ej: Avenida Logística 45, Valencia, España",
        type: "text",
        required: true,
        minLength: 3,
      },
      {
        id: "registerSanitario",
        label: "Licencia de Transporte Sanitario",
        placeholder: "Ej: LTS-2024-9012",
        type: "text",
        required: true,
        minLength: 5,
        description: "Licencia oficial para transporte de material sanitario"
      },
    ],
  },
};

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  companyRole,
  companyName,
  location,
  registerSanitario,
  onFieldChange,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Obtener configuración según el rol
  const config = roleFieldsConfig[companyRole] || roleFieldsConfig["Collector Center"];

  // Mapa de valores actuales
  const fieldValues: Record<string, string> = {
    companyName,
    location,
    registerSanitario,
  };

  const validateField = (field: string, value: string, fieldConfig: any): string | undefined => {
    if (fieldConfig.required && !value.trim()) {
      return `${fieldConfig.label} es requerido`;
    }
    if (fieldConfig.minLength && value.trim().length < fieldConfig.minLength) {
      return `${fieldConfig.label} debe tener al menos ${fieldConfig.minLength} caracteres`;
    }
    return undefined;
  };

  const handleChange = (field: string, value: string) => {
    onFieldChange(field, value);

    // Validate on change if field was touched
    if (touched[field]) {
      const fieldConfig = config.fields.find(f => f.id === field);
      if (fieldConfig) {
        const error = validateField(field, value, fieldConfig);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldConfig = config.fields.find(f => f.id === field);
    if (fieldConfig) {
      const error = validateField(field, value, fieldConfig);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Obtener ícono según el rol
  const getRoleIcon = () => {
    switch (companyRole) {
      case "Collector Center":
        return "🏥";
      case "Laboratory":
        return "🔬";
      case "Trader":
        return "🚚";
      default:
        return "📋";
    }
  };

  // Obtener color según el rol
  const getRoleColor = () => {
    switch (companyRole) {
      case "Collector Center":
        return "blood";
      case "Laboratory":
        return "medical";
      case "Trader":
        return "blockchain";
      default:
        return "slate";
    }
  };

  const roleColor = getRoleColor();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header con ícono del rol */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-6xl mb-4"
        >
          {getRoleIcon()}
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {config.title}
        </h3>
        <p className="text-slate-600">
          {config.subtitle}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Renderizar campos dinámicamente */}
        {config.fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              {field.label} {field.required && <span className="text-blood-600">*</span>}
            </label>

            {field.type === "text" || field.type === "number" ? (
              <input
                type={field.type}
                id={field.id}
                value={fieldValues[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={(e) => handleBlur(field.id, e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-${roleColor}-200
                  ${errors[field.id] && touched[field.id]
                    ? "border-blood-300 bg-blood-50"
                    : `border-slate-300 focus:border-${roleColor}-500`
                  }
                `}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" && field.options ? (
              <select
                id={field.id}
                value={fieldValues[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={(e) => handleBlur(field.id, e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-${roleColor}-200
                  ${errors[field.id] && touched[field.id]
                    ? "border-blood-300 bg-blood-50"
                    : `border-slate-300 focus:border-${roleColor}-500`
                  }
                `}
              >
                <option value="">Selecciona una opción</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : null}

            {/* Description helper text */}
            {field.description && !errors[field.id] && (
              <p className="mt-1 text-xs text-slate-500 flex items-start gap-1">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {field.description}
              </p>
            )}

            {/* Error message */}
            {errors[field.id] && touched[field.id] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-blood-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[field.id]}
              </motion.p>
            )}
          </div>
        ))}

        {/* Info Message - Dinámico según el rol */}
        <div className={`bg-${roleColor}-50 border-2 border-${roleColor}-200 rounded-xl p-4`}>
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 text-${roleColor}-600 mt-0.5 flex-shrink-0`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className={`text-sm text-${roleColor}-900 font-semibold mb-1`}>
                Información importante
              </p>
              <p className={`text-sm text-${roleColor}-800`}>
                Estos datos se registrarán permanentemente en la blockchain y no podrán ser modificados.
                Verifica que toda la información sea correcta antes de continuar.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyInfo;
