import React from "react";
import Link from "next/link";
import { AppContainer } from "../app/layout";
import Container from "./ui/Container";
import Grid from "./ui/Grid";

const Footer = () => {
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
