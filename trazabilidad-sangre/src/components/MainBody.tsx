"use client";

import React from "react";
import Link from "next/link";
import HeroSection from "./content/HeroSection";
import Container from "./ui/Container";
import Section from "./ui/Section";
import Grid from "./ui/Grid";
import Card from "./ui/Card";
import { motion } from "framer-motion";

const MainBody = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Trazabilidad de Sangre con Blockchain"
        subtitle="Conectando toda la cadena de valor desde el donante hasta el receptor con tecnología blockchain"
        backgroundImage="/images/content/company/hero-blood.jpg"
        height="xl"
      />

      {/* Features Section */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Plataforma de{" "}
              <span className="text-blood-600">Trazabilidad</span> con{" "}
              <span className="text-blockchain-600">Blockchain</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Nuestra plataforma aprovecha la tecnología blockchain para
              garantizar la trazabilidad completa de la sangre, protegiendo
              datos sensibles y conectando todo el ecosistema.
            </motion.p>
          </div>

          <Grid cols={{ xs: 1, sm: 2, lg: 4 }} gap={6}>
            {[
              {
                title: "Escalable",
                description:
                  "Diseñado para acelerar la adopción de blockchain en el sector salud",
                icon: "📈",
                color: "blood",
              },
              {
                title: "Flexible",
                description:
                  "Mantiene la flexibilidad para evolucionar y satisfacer necesidades futuras",
                icon: "🔄",
                color: "blockchain",
              },
              {
                title: "Seguro",
                description:
                  "Aprovecha las características de seguridad inherentes de blockchain",
                icon: "🔒",
                color: "medical",
              },
              {
                title: "Personalizable",
                description:
                  "Adapta la plataforma a las necesidades específicas de tu organización",
                icon: "⚙️",
                color: "blood",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="elevated"
                  hoverable
                  className="h-full text-center p-6"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Roles Section */}
      <Section className="bg-gradient-to-br from-blood-50 to-blockchain-50">
        <Container>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Roles en el Ecosistema
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Cada participante juega un papel crucial en la cadena de
              trazabilidad
            </motion.p>
          </div>

          <Grid cols={{ xs: 1, sm: 2, lg: 4 }} gap={6}>
            {[
              {
                role: "Donante",
                description:
                  "Personas que donan sangre para salvar vidas",
                icon: "🩸",
                color: "blood",
              },
              {
                role: "Centro de Donación",
                description:
                  "Recolecta y registra donaciones en blockchain",
                icon: "🏥",
                color: "blockchain",
              },
              {
                role: "Laboratorio",
                description:
                  "Procesa sangre en derivados (plasma, eritrocitos, plaquetas)",
                icon: "🔬",
                color: "medical",
              },
              {
                role: "Trader",
                description:
                  "Facilita el intercambio de derivados entre entidades",
                icon: "🤝",
                color: "blood",
              },
            ].map((role, index) => (
              <motion.div
                key={role.role}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="outlined"
                  hoverable
                  className="h-full text-center p-6 border-2 hover:border-blood-300 transition-colors"
                >
                  <div className="text-5xl mb-4">{role.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {role.role}
                  </h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section>
        <Container>
          <div className="bg-gradient-to-r from-blood-600 to-blockchain-600 rounded-2xl p-8 lg:p-12 text-white shadow-xl">
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-4"
              >
                Impacto en Números
              </motion.h2>
            </div>

            <Grid cols={{ xs: 1, sm: 3 }} gap={8}>
              {[
                { value: "100%", label: "Trazabilidad Completa" },
                { value: "Blockchain", label: "Seguridad Garantizada" },
                { value: "24/7", label: "Disponibilidad" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold mb-2 text-medical-300">
                    {stat.value}
                  </div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </motion.div>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg text-gray-600">
              Conecta tu wallet para acceder a la plataforma de trazabilidad de sangre y forma parte de la revolución blockchain en salud.
            </p>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
};

export default MainBody;
