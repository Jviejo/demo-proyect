"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle with Label */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold relative",
                    {
                      "bg-gradient-to-br from-blood-600 to-blood-700 text-white shadow-lg": isActive,
                      "bg-medical-600 text-white": isCompleted,
                      "bg-slate-200 text-slate-500": !isActive && !isCompleted,
                    }
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive
                      ? "0 10px 25px -5px rgba(220, 38, 38, 0.3), 0 8px 10px -6px rgba(220, 38, 38, 0.3)"
                      : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Active Pulse Ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blood-600"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{ rotate: isCompleted ? 360 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm">{stepNumber}</span>
                    )}
                  </motion.div>
                </motion.div>

                {/* Label with Animation */}
                <motion.span
                  className={clsx(
                    "text-xs mt-2 text-center whitespace-nowrap transition-colors duration-300",
                    {
                      "text-blood-700 font-bold": isActive,
                      "text-medical-600 font-semibold": isCompleted,
                      "text-slate-400 font-medium": !isActive && !isCompleted,
                    }
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {step}
                </motion.span>
              </div>

              {/* Connector Line with Animation */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200 overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-medical-600 to-blockchain-600"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{
                      scaleX: stepNumber < currentStep ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: stepNumber < currentStep ? 0.1 : 0,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
