'use client';

import { AppContainer } from "../layout";
import "./../globals.css";
import { motion } from 'framer-motion';
import WebinarCard from "@/components/content/WebinarCard";
import HeroSection from "@/components/content/HeroSection";

export default function Webinar() {
  // Upcoming webinars (future dates)
  const upcomingWebinars = [
    {
      title: "Trazabilidad Blockchain en Productos Sanguíneos: Casos de Éxito",
      description: "Descubre cómo hospitales y laboratorios europeos están implementando blockchain para garantizar la trazabilidad completa de donaciones y derivados sanguíneos. Casos reales, lecciones aprendidas y mejores prácticas.",
      speaker: "Dr. María González",
      speakerRole: "Directora de Innovación, Hospital Universitario La Paz",
      date: "2026-02-15T10:00:00",
      duration: "90 min",
      image: "/images/content/webinars/upcoming-1.webp",
      registrationLink: "#register-1"
    },
    {
      title: "Normativa Europea de Donación de Sangre: Actualización 2026",
      description: "Sesión informativa sobre las últimas actualizaciones en normativas europeas de donación, almacenamiento y distribución de sangre y derivados. Incluye guía práctica de cumplimiento y adaptación digital.",
      speaker: "Dra. Sophie Dubois",
      speakerRole: "Asesora Legal, Comisión Europea de Salud",
      date: "2026-03-10T15:00:00",
      duration: "60 min",
      image: "/images/content/webinars/upcoming-2.webp",
      registrationLink: "#register-2"
    }
  ];

  // Past webinars (recordings available)
  const pastWebinars = [
    {
      title: "Introducción a la Plataforma de Trazabilidad Blockchain",
      description: "Workshop técnico sobre nuestra plataforma: arquitectura, smart contracts, integración con sistemas existentes y primeros pasos para centros de donación y laboratorios.",
      speaker: "Ing. Carlos Martínez",
      speakerRole: "CTO, BloodChain",
      date: "2025-12-20T11:00:00",
      duration: "120 min",
      image: "/images/content/webinars/past-1.webp",
      isUpcoming: false,
      recordingLink: "#watch-1"
    },
    {
      title: "Seguridad y Privacidad en Datos de Salud: GDPR y Blockchain",
      description: "Cómo garantizar el cumplimiento de GDPR al trabajar con blockchain en el sector salud. Anonimización, encriptación y gestión de consentimiento en trazabilidad de productos sanguíneos.",
      speaker: "Dra. Anna Schmidt",
      speakerRole: "Especialista en Privacidad de Datos, EuroHealth Compliance",
      date: "2025-11-18T14:00:00",
      duration: "75 min",
      image: "/images/content/webinars/past-2.webp",
      isUpcoming: false,
      recordingLink: "#watch-2"
    }
  ];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-green-50">

        {/* Hero Section */}
        <HeroSection
          title="Webinars"
          subtitle="Formación continua sobre trazabilidad blockchain, normativas europeas y mejores prácticas en gestión de productos sanguíneos"
          backgroundImage="/images/content/webinars/hero-bg.webp"
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Upcoming Webinars Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-success-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Próximos Webinars
              </h2>
              <div className="ml-auto">
                <span className="px-4 py-2 bg-success-500 text-white text-sm font-semibold rounded-full animate-pulse">
                  {upcomingWebinars.length} próximamente
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingWebinars.map((webinar, index) => (
                <WebinarCard
                  key={index}
                  {...webinar}
                  index={index}
                />
              ))}
            </div>

            {/* Registration Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg border-l-4 border-primary-500"
            >
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Información de Registro</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Los webinars son <strong>gratuitos</strong> para profesionales del sector sanitario.
                    Recibirás un enlace de acceso 24h antes del evento. Certificado de asistencia disponible.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Past Webinars Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Grabaciones Disponibles
              </h2>
              <div className="ml-auto">
                <span className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-full">
                  {pastWebinars.length} disponibles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastWebinars.map((webinar, index) => (
                <WebinarCard
                  key={index}
                  {...webinar}
                  index={index}
                />
              ))}
            </div>

            {/* Access Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border-l-4 border-gray-500"
            >
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Acceso a Grabaciones</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Las grabaciones están disponibles durante 6 meses. Incluyen presentaciones descargables,
                    transcripciones y recursos adicionales compartidos por los speakers.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Newsletter Subscription */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20"
          >
            <div className="bg-gradient-to-r from-primary-500 to-success-500 rounded-2xl p-12 text-center shadow-card-hover">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿No te quieres perder ningún webinar?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Suscríbete a nuestro newsletter y recibe notificaciones sobre próximos eventos,
                contenido exclusivo y actualizaciones de la plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  Suscribirme
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </AppContainer>
  );
}
