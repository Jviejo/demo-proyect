"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface RoleSelectionProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const roles = [
  {
    id: "Collector Center",
    name: "Collector Center",
    description: "Centros de recolección de donaciones de sangre",
    icon: "🏥",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "Laboratory",
    name: "Laboratory",
    description: "Laboratorios que procesan sangre en derivados",
    icon: "🔬",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "Trader",
    name: "Trader",
    description: "Distribuidores y comercializadores de derivados",
    icon: "🚚",
    color: "from-green-500 to-green-600",
  },
];

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Selecciona tu Rol
        </h3>
        <p className="text-gray-600">
          Elige el tipo de entidad que mejor represente tu organización
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleSelect(role.id)}
              className={clsx(
                "relative p-6 rounded-xl cursor-pointer transition-all duration-300",
                "border-2 hover:shadow-xl",
                {
                  "border-primary-600 shadow-lg ring-2 ring-primary-200": isSelected,
                  "border-gray-200 hover:border-primary-300": !isSelected,
                }
              )}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon with Gradient */}
              <div className={clsx(
                "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl",
                "bg-gradient-to-br shadow-md",
                role.color
              )}>
                {role.icon}
              </div>

              {/* Role Name */}
              <h4 className={clsx(
                "text-lg font-bold text-center mb-2 transition-colors",
                {
                  "text-primary-600": isSelected,
                  "text-gray-900": !isSelected,
                }
              )}>
                {role.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center">
                {role.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Error Message */}
      {!selectedRole && (
        <p className="text-red-500 text-sm text-center mt-4 opacity-0">
          Por favor selecciona un rol para continuar
        </p>
      )}
    </div>
  );
};

export default RoleSelection;
