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
    color: "from-blood-500 to-blood-700",
    bgColor: "bg-blood-50",
    borderColor: "border-blood-200",
    textColor: "text-blood-700",
  },
  {
    id: "Laboratory",
    name: "Laboratory",
    description: "Laboratorios que procesan sangre en derivados",
    icon: "🔬",
    color: "from-medical-500 to-medical-700",
    bgColor: "bg-medical-50",
    borderColor: "border-medical-200",
    textColor: "text-medical-700",
  },
  {
    id: "Trader",
    name: "Trader",
    description: "Distribuidores y comercializadores de derivados",
    icon: "🚚",
    color: "from-blockchain-500 to-blockchain-700",
    bgColor: "bg-blockchain-50",
    borderColor: "border-blockchain-200",
    textColor: "text-blockchain-700",
  },
];

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          Selecciona tu Rol
        </h3>
        <p className="text-lg text-slate-600">
          Elige el tipo de entidad que mejor represente tu organización
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onRoleSelect(role.id)}
              className={clsx(
                "relative p-8 rounded-2xl cursor-pointer transition-all duration-300",
                "border-3 hover:shadow-2xl",
                {
                  [role.borderColor]: isSelected,
                  "border-slate-200 hover:border-slate-300": !isSelected,
                  "shadow-xl": isSelected,
                  "shadow-md hover:shadow-lg": !isSelected,
                  [role.bgColor]: isSelected,
                  "bg-white": !isSelected,
                }
              )}
            >
              {/* Selected Checkmark with Animation */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4"
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center shadow-md",
                    "bg-gradient-to-br",
                    role.color
                  )}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Icon with Gradient and Pulse */}
              <motion.div
                className={clsx(
                  "w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-5xl",
                  "bg-gradient-to-br shadow-lg relative",
                  role.color
                )}
                animate={{
                  boxShadow: isSelected
                    ? [
                        "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                        "0 10px 35px -5px rgba(0, 0, 0, 0.3)",
                        "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      ]
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                }}
                transition={{
                  duration: 2,
                  repeat: isSelected ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {/* Glow effect when selected */}
                {isSelected && (
                  <motion.div
                    className={clsx(
                      "absolute inset-0 rounded-2xl blur-xl opacity-50",
                      "bg-gradient-to-br",
                      role.color
                    )}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative z-10">{role.icon}</span>
              </motion.div>

              {/* Role Name */}
              <h4 className={clsx(
                "text-xl font-bold text-center mb-3 transition-colors duration-300",
                {
                  [role.textColor]: isSelected,
                  "text-slate-900": !isSelected,
                }
              )}>
                {role.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-slate-600 text-center leading-relaxed">
                {role.description}
              </p>

              {/* Bottom accent line when selected */}
              {isSelected && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className={clsx(
                    "h-1 w-full mt-6 rounded-full",
                    "bg-gradient-to-r",
                    role.color
                  )}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Error Message */}
      {!selectedRole && (
        <p className="text-blood-600 text-sm text-center mt-6 opacity-0">
          Por favor selecciona un rol para continuar
        </p>
      )}
    </div>
  );
};

export default RoleSelection;
