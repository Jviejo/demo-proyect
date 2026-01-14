'use client';

import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import { motion } from "framer-motion";
import Image from "next/image";
import "./../globals.css";

export default function Servicios() {
  const services = [
    {
      title: "Consultancy",
      subtitle: "Asesoramiento Estratégico en Blockchain",
      description: "Te guiamos en cada paso de tu transformación digital hacia blockchain. Desde análisis de viabilidad hasta diseño de arquitectura, nuestros expertos te ayudan a tomar decisiones informadas.",
      image: "/images/content/services/consultancy.webp",
      features: [
        "Análisis de viabilidad y ROI",
        "Diseño de arquitectura blockchain",
        "Evaluación de riesgos y compliance",
        "Roadmap de implementación",
        "Capacitación del equipo",
        "Auditoría de procesos actuales"
      ],
      price: "Desde €5,000",
      icon: "💼",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Implementation",
      subtitle: "Despliegue e Integración Completa",
      description: "Implementamos la solución blockchain end-to-end en tu infraestructura existente. Configuración de nodos, despliegue de smart contracts y conexión con sistemas legacy.",
      image: "/images/content/services/implementation.webp",
      features: [
        "Configuración de infraestructura blockchain",
        "Despliegue de smart contracts",
        "Integración con sistemas legacy",
        "Migración de datos históricos",
        "Testing exhaustivo",
        "Go-live asistido"
      ],
      price: "Desde €15,000",
      icon: "🚀",
      color: "from-primary-500 to-primary-600"
    },
    {
      title: "Infrastructure",
      subtitle: "Gestión y Mantenimiento de Nodos",
      description: "Nos encargamos de toda la infraestructura técnica. Hosting de nodos blockchain, monitoreo 24/7, backups automáticos y escalamiento según tus necesidades.",
      image: "/images/content/services/infrastructure.webp",
      features: [
        "Hosting de nodos blockchain",
        "Monitoreo 24/7 y alertas",
        "Backups automáticos diarios",
        "Escalamiento automático",
        "Seguridad y firewall",
        "SLA 99.9% uptime"
      ],
      price: "Desde €2,000/mes",
      icon: "🏗️",
      color: "from-success-500 to-green-600"
    },
    {
      title: "Development",
      subtitle: "Desarrollo Custom de Smart Contracts",
      description: "Desarrollamos smart contracts personalizados para tus necesidades específicas. Testing, auditoría y optimización de gas fees incluidos.",
      image: "/images/content/services/development.webp",
      features: [
        "Smart contracts custom en Solidity",
        "Testing automatizado completo",
        "Auditoría de seguridad",
        "Optimización de gas fees",
        "Documentación técnica",
        "Código fuente y ownership"
      ],
      price: "Desde €8,000",
      icon: "💻",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Servicios Profesionales Blockchain"
          subtitle="Soluciones integrales para transformar tu gestión de productos sanguíneos"
          height="md"
        />

        {/* Introduction */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Todo lo que Necesitas para Tener Éxito
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Desde la consultoría inicial hasta el soporte continuo, ofrecemos un conjunto completo
              de servicios profesionales para garantizar el éxito de tu implementación blockchain.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: "✅", label: "Certificado ISO 9001" },
              { icon: "🛡️", label: "Auditorías de Seguridad" },
              { icon: "📞", label: "Soporte 24/7" },
              { icon: "🌍", label: "25+ Países" }
            ].map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-card text-center"
              >
                <div className="text-3xl mb-2">{indicator.icon}</div>
                <div className="text-sm font-semibold text-gray-700">{indicator.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-30`} />

                    {/* Icon Badge */}
                    <div className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br ${service.color} shadow-xl flex items-center justify-center text-3xl`}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-primary-600">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-6 flex-grow">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                        Incluye:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="text-success-500 mt-0.5 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="border-t pt-6 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Precio
                          </div>
                          <div className={`text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                            {service.price}
                          </div>
                        </div>
                      </div>

                      <motion.a
                        href="/contact"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`block w-full text-center py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${service.color} hover:shadow-lg transition-all duration-300`}
                      >
                        Solicitar Presupuesto
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un enfoque estructurado para garantizar el éxito de tu proyecto
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Descubrimiento",
                description: "Entendemos tus necesidades, procesos actuales y objetivos de negocio"
              },
              {
                step: "02",
                title: "Planificación",
                description: "Diseñamos la arquitectura y roadmap personalizado para tu organización"
              },
              {
                step: "03",
                title: "Implementación",
                description: "Desarrollamos e integramos la solución con testing exhaustivo"
              },
              {
                step: "04",
                title: "Soporte",
                description: "Monitoreo continuo, mantenimiento y optimización de la plataforma"
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="text-6xl font-bold text-primary-100 mb-4">
                  {process.step}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {process.description}
                </p>

                {/* Connector Line (except last) */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -ml-4" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 px-4 bg-gradient-to-r from-primary-600 via-primary-500 to-success-500 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-6"
            >
              🎯
            </motion.div>
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para Comenzar tu Transformación?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Agenda una consulta gratuita con nuestros expertos y descubre cómo blockchain
              puede revolucionar tu gestión de productos sanguíneos
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl"
              >
                Agendar Consulta Gratuita
              </motion.a>
              <motion.a
                href="/our-promise"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/30"
              >
                Ver Nuestro Compromiso
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "¿Cuánto tiempo toma implementar la solución?",
                answer: "Depende del alcance, pero una implementación típica toma de 8 a 12 semanas desde el kickoff hasta el go-live."
              },
              {
                question: "¿Ofrecen capacitación para nuestro equipo?",
                answer: "Sí, todos nuestros paquetes incluyen capacitación completa del equipo y documentación detallada."
              },
              {
                question: "¿Qué nivel de soporte técnico incluye?",
                answer: "Ofrecemos soporte 24/7 con SLA de respuesta garantizado. Incluye monitoreo proactivo y actualizaciones regulares."
              },
              {
                question: "¿Puedo combinar varios servicios?",
                answer: "Absolutamente. Ofrecemos paquetes personalizados que combinan múltiples servicios con descuentos especiales."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppContainer>
  );
}
