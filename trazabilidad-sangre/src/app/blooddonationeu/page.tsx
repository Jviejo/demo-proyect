"use client";

import React from "react";
import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import EuropeMap from "@/components/content/EuropeMap";
import CountryAccordion from "@/components/content/CountryAccordion";
import Timeline from "@/components/content/Timeline";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./../globals.css";

// Map data for Europe
const mapData = [
  { country: "España", donations: 1850000, color: "#503291" },
  { country: "Francia", donations: 3200000, color: "#6b46c1" },
  { country: "Alemania", donations: 4500000, color: "#32cd32" },
  { country: "Italia", donations: 2800000, color: "#7c3aed" },
  { country: "Polonia", donations: 1200000, color: "#059669" },
  { country: "Reino Unido", donations: 2100000, color: "#8b5cf6" },
];

// Country regulations data
const countryRegulations = [
  {
    country: "España",
    flag: "🇪🇸",
    eligibility: [
      "Edad: 18-65 años",
      "Peso mínimo: 50 kg",
      "Salud general buena",
      "Intervalo: 2 meses (hombres), 3 meses (mujeres)",
    ],
    process: [
      "Registro y cuestionario",
      "Examen médico",
      "Extracción (8-10 min)",
      "Descanso y refrigerio",
    ],
    regulations: [
      "Real Decreto 1088/2005",
      "Directiva UE 2002/98/CE",
      "AEMPS supervisión",
      "Normas ISO 15189",
    ],
  },
  {
    country: "Francia",
    flag: "🇫🇷",
    eligibility: [
      "Edad: 18-70 años",
      "Peso mínimo: 50 kg",
      "Sin tatuajes recientes (4 meses)",
      "Intervalo: 8 semanas",
    ],
    process: [
      "Cita previa online",
      "Cuestionario salud",
      "Test hemoglobina",
      "Donación supervisada",
    ],
    regulations: [
      "Code de la Santé Publique",
      "Agence de la biomédecine",
      "Norma NF EN ISO 15189",
      "EFS (Établissement Français du Sang)",
    ],
  },
  {
    country: "Alemania",
    flag: "🇩🇪",
    eligibility: [
      "Edad: 18-68 años (primera vez hasta 60)",
      "Peso mínimo: 50 kg",
      "No consumo drogas",
      "Intervalo: 8-12 semanas",
    ],
    process: [
      "Registro digital",
      "Entrevista médica",
      "Análisis rápido",
      "Extracción y monitoreo",
    ],
    regulations: [
      "Transfusionsgesetz (TFG)",
      "Richtlinien Bundesärztekammer",
      "Paul-Ehrlich-Institut",
      "DIN EN ISO 15189",
    ],
  },
  {
    country: "Italia",
    flag: "🇮🇹",
    eligibility: [
      "Edad: 18-65 años",
      "Peso mínimo: 50 kg",
      "Presión arterial normal",
      "Intervalo: 90 días",
    ],
    process: [
      "Registro AVIS/FIDAS",
      "Control médico",
      "Extracción estándar",
      "Seguimiento post-donación",
    ],
    regulations: [
      "Decreto Legislativo 261/2007",
      "Centro Nazionale Sangue",
      "Norma UNI EN ISO 15189",
      "Accreditamento regionale",
    ],
  },
  {
    country: "Polonia",
    flag: "🇵🇱",
    eligibility: [
      "Edad: 18-65 años",
      "Peso mínimo: 50 kg",
      "Certificado médico",
      "Intervalo: 8 semanas (hombres), 12 semanas (mujeres)",
    ],
    process: [
      "Registro en RCKiK",
      "Examen preliminar",
      "Donación controlada",
      "Certificado de donante",
    ],
    regulations: [
      "Ustawa o publicznej służbie krwi",
      "Ministerstwo Zdrowia",
      "Norma PN-EN ISO 15189",
      "RCKiK supervisión",
    ],
  },
];

// Standard EU donation process timeline
const euProcessTimeline = [
  {
    title: "Registro",
    description:
      "Inscripción del donante con identificación oficial y consentimiento informado.",
    date: "Paso 1",
    icon: "📝",
  },
  {
    title: "Cuestionario de Salud",
    description:
      "Evaluación de elegibilidad mediante cuestionario estandarizado europeo.",
    date: "Paso 2",
    icon: "📋",
  },
  {
    title: "Examen Médico",
    description:
      "Revisión de presión arterial, hemoglobina y evaluación general de salud.",
    date: "Paso 3",
    icon: "🩺",
  },
  {
    title: "Extracción de Sangre",
    description:
      "Donación de 450ml ± 10% en condiciones estériles controladas.",
    date: "Paso 4",
    icon: "🩸",
  },
  {
    title: "Procesamiento",
    description:
      "Separación en componentes (plasma, eritrocitos, plaquetas) en laboratorio certificado.",
    date: "Paso 5",
    icon: "⚗️",
  },
  {
    title: "Análisis y Trazabilidad",
    description:
      "Tests serológicos, registro blockchain y etiquetado con código único.",
    date: "Paso 6",
    icon: "🔬",
  },
];

// Chart data for donations by country
const chartData = mapData.map((d) => ({
  name: d.country,
  donaciones: d.donations / 1000,
}));

export default function BloodDonationEU() {
  return (
    <AppContainer>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Donación de Sangre en la Unión Europea"
          subtitle="Sistema Unificado de Trazabilidad y Regulación | Blockchain + Directivas UE"
          backgroundImage="/images/content/eu/map-hero.webp"
          ctaText="Ver Estadísticas"
          ctaLink="#stats"
        />

        {/* Europe Map with Stats */}
        <section className="container mx-auto px-4 py-12">
          <EuropeMap data={mapData} />
        </section>

        {/* Chart Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-card p-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📊 Donaciones Anuales por País (miles)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value}k donaciones`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="donaciones" fill="#503291" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </section>

        {/* Regulations by Country */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              🇪🇺 Regulaciones por País
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Cada país de la UE implementa las directivas europeas adaptándolas
              a su sistema de salud nacional. Explora los requisitos específicos:
            </p>
            <CountryAccordion countries={countryRegulations} />
          </motion.div>
        </section>

        {/* EU Standard Process Timeline */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              🔄 Proceso Estándar de Donación EU
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              El proceso de donación está armonizado en toda la UE bajo la
              Directiva 2002/98/CE, garantizando seguridad y trazabilidad.
            </p>
            <Timeline items={euProcessTimeline} />
          </motion.div>
        </section>

        {/* Blockchain Integration Info */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-success-600 rounded-lg shadow-card p-8 text-white"
          >
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                🔗 Trazabilidad Blockchain Trans-Europea
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Nuestro sistema integra las normativas de cada país en un registro
                blockchain inmutable, permitiendo trazabilidad completa desde el
                donante hasta el receptor final, cumpliendo con GDPR y directivas
                de la UE.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-4xl font-bold">27</p>
                  <p className="text-sm opacity-90">Países EU Integrados</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-4xl font-bold">99.8%</p>
                  <p className="text-sm opacity-90">Trazabilidad Completa</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-4xl font-bold">24/7</p>
                  <p className="text-sm opacity-90">Monitoreo en Tiempo Real</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Compliance Section */}
        <section className="container mx-auto px-4 py-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📜 Cumplimiento Normativo
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-3xl mb-2">🇪🇺</p>
                <p className="font-semibold text-gray-800">Directiva 2002/98/CE</p>
                <p className="text-sm text-gray-600">Normas de calidad y seguridad</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-3xl mb-2">🔒</p>
                <p className="font-semibold text-gray-800">GDPR Compliant</p>
                <p className="text-sm text-gray-600">
                  Protección de datos personales
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-semibold text-gray-800">ISO 15189</p>
                <p className="text-sm text-gray-600">
                  Laboratorios clínicos certificados
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-3xl mb-2">🔐</p>
                <p className="font-semibold text-gray-800">Blockchain Immutable</p>
                <p className="text-sm text-gray-600">Registro permanente</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </AppContainer>
  );
}
