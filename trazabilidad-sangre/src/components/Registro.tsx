"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./../app/globals.css";
import styles from "./Registro.module.css";
import { abi as abiTracker } from "@/../../src/lib/contracts/BloodTracker";
import { useWallet } from "./ConnectWalletButton";
import { useRouter } from "next/navigation";
import StepIndicator from "./registro/StepIndicator";
import RoleSelection from "./registro/RoleSelection";
import CompanyInfo from "./registro/CompanyInfo";
import ConfirmationStep from "./registro/ConfirmationStep";
import Button from "./ui/Button";
import { showTransactionSuccess, showTransactionError, showTransactionPending } from "@/lib/toast";

const STEPS = ["Rol", "Información", "Confirmación"];

const Register = () => {
  const { account, web3, setRole } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [companyRole, setCompanyRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [registerSanitario, setRegisterSanitario] = useState("");

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return companyRole !== "";
      case 2:
        return (
          companyName.trim().length >= 3 &&
          location.trim().length >= 3 &&
          registerSanitario.trim().length >= 5
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "companyName":
        setCompanyName(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "registerSanitario":
        setRegisterSanitario(value);
        break;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    setIsSubmitting(true);

    try {
      // Map role to number
      let roleNum;
      switch (companyRole) {
        case "Collector Center":
          roleNum = 1;
          break;
        case "Laboratory":
          roleNum = 2;
          break;
        case "Trader":
          roleNum = 3;
          break;
        default:
          roleNum = 0;
          break;
      }

      // Show pending toast
      const pendingToastId = showTransactionPending();

      // Submit transaction
      const contractTracker = new web3.eth.Contract(
        abiTracker,
        process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS
      );

      const receipt = await contractTracker.methods
        .signUp(companyName, location, roleNum)
        .send({ from: account, gas: "1000000", gasPrice: 1000000000 });

      // Update role in context
      setRole(roleNum);

      // Show success toast
      showTransactionSuccess(receipt.transactionHash);

      // Navigate to dashboard
      setTimeout(() => {
        router.push("/all-role-grid");
      }, 2000);
    } catch (error: any) {
      console.error("Error registering:", error);
      showTransactionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
  };

  return (
    <section className={styles.section}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Compañía
          </h2>
          <p className="text-gray-600">
            Completa el proceso de registro para unirte a la red de trazabilidad
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Step Content with Animation */}
        <div className="relative min-h-[500px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {currentStep === 1 && (
                <RoleSelection
                  selectedRole={companyRole}
                  onRoleSelect={setCompanyRole}
                />
              )}

              {currentStep === 2 && (
                <CompanyInfo
                  companyName={companyName}
                  location={location}
                  registerSanitario={registerSanitario}
                  onFieldChange={handleFieldChange}
                />
              )}

              {currentStep === 3 && (
                <ConfirmationStep
                  companyRole={companyRole}
                  companyName={companyName}
                  location={location}
                  registerSanitario={registerSanitario}
                  account={account}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          {/* Previous Button */}
          <Button
            onClick={() => {
              paginate(-1);
              handlePrev();
            }}
            variant="ghost"
            disabled={currentStep === 1 || isSubmitting}
            className="min-w-[120px]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </Button>

          {/* Step Counter */}
          <div className="text-sm text-gray-500">
            Paso {currentStep} de {STEPS.length}
          </div>

          {/* Next/Submit Button */}
          {currentStep < STEPS.length ? (
            <Button
              onClick={() => {
                paginate(1);
                handleNext();
              }}
              variant="primary"
              disabled={!canGoNext() || isSubmitting}
              className="min-w-[120px]"
            >
              Siguiente
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="success"
              disabled={!canGoNext() || isSubmitting}
              loading={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Registrando..." : "Confirmar Registro"}
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
