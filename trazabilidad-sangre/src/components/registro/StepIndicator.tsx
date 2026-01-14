"use client";

import React from "react";
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
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold",
                    {
                      "bg-primary-600 text-white shadow-lg scale-110": isActive,
                      "bg-primary-500 text-white": isCompleted,
                      "bg-gray-200 text-gray-500": !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span
                  className={clsx(
                    "text-xs mt-2 text-center whitespace-nowrap",
                    {
                      "text-primary-600 font-semibold": isActive,
                      "text-primary-500 font-medium": isCompleted,
                      "text-gray-400": !isActive && !isCompleted,
                    }
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "flex-1 h-1 mx-2 rounded-full transition-all duration-300",
                    {
                      "bg-primary-500": stepNumber < currentStep,
                      "bg-gray-200": stepNumber >= currentStep,
                    }
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
