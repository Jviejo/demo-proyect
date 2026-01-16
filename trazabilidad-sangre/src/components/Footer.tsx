"use client";

import React from "react";
import Link from "next/link";
import { AppContainer } from "../app/layout";
import Container from "./ui/Container";
import Grid from "./ui/Grid";
import { useWallet } from "./ConnectWalletButton";
import { truncateAddress } from "@/lib/helpers";

const Footer = () => {
  const { network } = useWallet();

  return (
    <footer className="bg-gradient-to-br from-blood-700 to-blockchain-700 text-white mt-16">
      <Container>
        <div className="py-12 lg:py-16">
          <Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap={8}>
            {/* Company Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/cadena-de-bloques.png"
                  alt="Logo"
                  className="h-10 w-10 object-contain"
                />
                <Link
                  href="https://codecrypto.academy/"
                  className="text-xl font-bold hover:text-medical-300 transition-colors"
                >
                  codecrypto.academy
                </Link>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                <p>Masters en Blockchain & Web3</p>
                <p>Sé referente Blockchain en 12 meses</p>
                <p className="font-semibold text-medical-300">
                  100+ Alumnos Formados 8º Ed
                </p>
                <p>CodeCrypto World Podcast</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/20 pb-2">
                Contacto
              </h2>
              <div className="space-y-2 text-sm text-white/80">
                <p className="flex items-center gap-2">
                  <span className="text-medical-300">📍</span>
                  Madrid, ESP
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-medical-300">✉️</span>
                  codecrypto@codecrypto.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-medical-300">📞</span>
                  +34 654 768 987
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/20 pb-2">
                Let's Get in Touch
              </h2>
              <p className="text-sm text-white/80">
                ¿Tienes un proyecto en mente? Hablemos sobre cómo podemos
                ayudarte.
              </p>
              <Link
                href="/get-in-touch"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blood-600 rounded-lg font-semibold text-sm hover:bg-medical-300 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Contáctanos
              </Link>
            </div>
          </Grid>
        </div>

        {/* Contract Information */}
        <div className="border-t border-white/20 py-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-sm font-semibold text-medical-300 mb-3 flex items-center gap-2">
              <span>🔗</span>
              Información de Contratos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/80">
              <div className="flex flex-col gap-1">
                <span className="text-white/60">Red Activa:</span>
                <span className="font-mono font-semibold text-white">
                  {network || "No conectado"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/60">BloodTracker:</span>
                <span className="font-mono text-white">
                  {truncateAddress(process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS || "")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/60">BloodDonation:</span>
                <span className="font-mono text-white">
                  {truncateAddress(process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS || "")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/80 mt-3">
              <div className="flex flex-col gap-1">
                <span className="text-white/60">BloodDerivative:</span>
                <span className="font-mono text-white">
                  {truncateAddress(process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS || "")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/60">Chain ID:</span>
                <span className="font-mono font-semibold text-white">
                  {process.env.NEXT_PUBLIC_CHAIN_ID || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>
              © 2024 Blood Donation Traceability. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors"
              >
                Trademark Policy
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
