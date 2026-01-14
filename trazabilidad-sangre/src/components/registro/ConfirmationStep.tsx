"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConfirmationStepProps {
  companyRole: string;
  companyName: string;
  location: string;
  registerSanitario: string;
  account: string;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  companyRole,
  companyName,
  location,
  registerSanitario,
  account,
}) => {
  const getRoleInfo = (role: string) => {
    switch (role) {
      case "Collector Center":
        return {
          icon: "🏥",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "Laboratory":
        return {
          icon: "🔬",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
      case "Trader":
        return {
          icon: "🚚",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      default:
        return {
          icon: "❓",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const roleInfo = getRoleInfo(companyRole);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Confirma tu Registro
        </h3>
        <p className="text-gray-600">
          Revisa que todos los datos sean correctos antes de registrarte en la blockchain
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Role Badge */}
        <div className={`p-6 rounded-xl border-2 ${roleInfo.bgColor} ${roleInfo.borderColor}`}>
          <div className="flex items-center">
            <div className="text-4xl mr-4">{roleInfo.icon}</div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rol seleccionado</p>
              <h4 className={`text-xl font-bold ${roleInfo.color}`}>{companyRole}</h4>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Datos de la Compañía
            </h4>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Company Name */}
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm text-gray-600">Nombre de la Compañía</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{companyName}</span>
            </div>

            {/* Location */}
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Ubicación</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{location}</span>
            </div>

            {/* Registro Sanitario */}
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Registro Sanitario</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{registerSanitario}</span>
            </div>

            {/* Wallet Address */}
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Wallet Address</span>
              </div>
              <span className="text-sm font-mono text-gray-900">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-amber-900 font-semibold mb-1">
                Registro permanente en blockchain
              </p>
              <p className="text-sm text-amber-800">
                Al confirmar, tus datos se registrarán de forma permanente en la blockchain.
                Esta acción no se puede deshacer ni los datos se pueden modificar posteriormente.
                Por favor, verifica que toda la información sea correcta antes de continuar.
              </p>
            </div>
          </div>
        </div>

        {/* Gas Fee Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-600 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              Se requerirá una pequeña cantidad de gas para completar la transacción
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationStep;
