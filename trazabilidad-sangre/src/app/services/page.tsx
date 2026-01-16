'use client';

import React, { useState } from 'react';
import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import StoryCard from "@/components/content/StoryCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { motion } from "framer-motion";
import Image from "next/image";
import "./../globals.css";

interface Story {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
      color: "from-blockchain-500 to-blockchain-600"
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
      color: "from-blood-500 to-blood-600"
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
      color: "from-medical-500 to-green-600"
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

  const stories: Story[] = [
    {
      id: 1,
      title: "Hospital Universitario reduce pérdidas en un 40%",
      excerpt: "Gracias a la implementación de nuestro sistema de trazabilidad blockchain, el Hospital Universitario Central logró reducir las pérdidas de productos sanguíneos en un 40% durante el primer año.",
      image: "/images/content/inspirations/story-1.webp",
      category: "Casos de Éxito",
      date: "15 Enero 2026",
      author: "Dr. Carlos Méndez",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Laboratorio Regional: Trazabilidad completa en 30 días",
      excerpt: "El Laboratorio Regional de Barcelona implementó nuestro sistema completo en solo 30 días. Ahora procesan más de 500 unidades de sangre mensualmente con trazabilidad completa.",
      image: "/images/content/inspirations/story-2.webp",
      category: "Implementación",
      date: "10 Enero 2026",
      author: "Dra. María Rodríguez",
      readTime: "4 min"
    },
    {
      id: 3,
      title: "Centro de Donación incrementa confianza de donantes",
      excerpt: "El Centro de Donación de Madrid reporta un incremento del 35% en donaciones recurrentes. Los donantes valoran poder rastrear en tiempo real cómo sus donaciones ayudan.",
      image: "/images/content/inspirations/story-3.webp",
      category: "Impacto Social",
      date: "5 Enero 2026",
      author: "Ana Martínez",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Blockchain garantiza autenticidad en cadena de frío",
      excerpt: "La implementación de smart contracts automatizó las alertas de temperatura crítica en tiempo real. Tres hospitales en Valencia evitaron pérdidas millonarias.",
      image: "/images/content/inspirations/story-4.webp",
      category: "Tecnología",
      date: "28 Diciembre 2025",
      author: "Ing. Roberto Sánchez",
      readTime: "7 min"
    },
    {
      id: 5,
      title: "Red de hospitales conectados salva vidas",
      excerpt: "Una red de 12 hospitales en Andalucía coordinó el intercambio de derivados sanguíneos escasos mediante nuestro marketplace descentralizado.",
      image: "/images/content/inspirations/story-5.webp",
      category: "Colaboración",
      date: "20 Diciembre 2025",
      author: "Dr. Javier López",
      readTime: "5 min"
    },
    {
      id: 6,
      title: "Paciente recupera salud gracias a trazabilidad transparente",
      excerpt: "María, paciente de 45 años con leucemia, recibió transfusiones de plaquetas con trazabilidad completa. Su familia pudo verificar el origen, procesamiento y calidad de cada unidad.",
      image: "/images/content/inspirations/story-6.webp",
      category: "Historia Personal",
      date: "15 Diciembre 2025",
      author: "Laura García",
      readTime: "8 min"
    }
  ];

  const categories = ["all", ...Array.from(new Set(stories.map(s => s.category)))];
  const filteredStories = selectedCategory === "all"
    ? stories
    : stories.filter(s => s.category === selectedCategory);

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Servicios Profesionales Blockchain"
          subtitle="Soluciones integrales para transformar tu gestión de productos sanguíneos"
          height="md"
        />

        {/* Introduction */}
        <Section className="py-16">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Todo lo que Necesitas para Tener Éxito
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
                  <div className="text-sm font-semibold text-slate-700">{indicator.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Services Grid */}
        <Section className="py-16 bg-slate-50">
          <Container>
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
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-blood-600">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-6 flex-grow">
                      <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
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
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <span className="text-medical-500 mt-0.5 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="border-t border-slate-200 pt-6 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Precio
                          </div>
                          <div className={`text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                            {service.price}
                          </div>
                        </div>
                      </div>

                      <motion.a
                        href="/get-in-touch"
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
          </Container>
        </Section>

        {/* Process Section */}
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Nuestro Proceso
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                  <div className="text-6xl font-bold text-blood-100 mb-4">
                    {process.step}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {process.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {process.description}
                  </p>

                  {/* Connector Line (except last) */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blood-300 to-transparent -ml-4" />
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Success Stories Section */}
        <Section className="py-16 bg-slate-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Historias de{' '}
                <span className="text-blood-600">Éxito</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Conoce cómo hospitales, laboratorios y centros de donación están transformando
                la gestión de productos sanguíneos con blockchain
              </p>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blood-600 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  {category === "all" ? "Todas las historias" : category}
                </button>
              ))}
            </motion.div>

            {/* Stats Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blood-600 to-blockchain-600 rounded-2xl p-8 mb-12 text-white shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">40%</div>
                  <div className="text-blood-100">Reducción de pérdidas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-blood-100">Unidades procesadas/mes</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">12</div>
                  <div className="text-blood-100">Hospitales conectados</div>
                </div>
              </div>
            </motion.div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  title={story.title}
                  excerpt={story.excerpt}
                  image={story.image}
                  category={story.category}
                  date={story.date}
                  author={story.author}
                  readTime={story.readTime}
                  index={index}
                  onReadMore={() => {
                    alert(`Navegando a la historia completa: "${story.title}"\n\nEsta funcionalidad se implementará en el futuro.`);
                  }}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  No hay historias en esta categoría
                </h3>
                <p className="text-slate-600">
                  Intenta seleccionar otra categoría para ver más historias
                </p>
              </motion.div>
            )}
          </Container>
        </Section>

        {/* FAQ Section */}
        <Section className="py-16">
          <Container className="max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
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
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section className="py-20 bg-gradient-to-r from-blood-600 via-blood-500 to-blockchain-500 text-white">
          <Container className="max-w-4xl">
            <div className="text-center">
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
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                <motion.a
                  href="/get-in-touch"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blood-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-xl"
                >
                  Agendar Consulta Gratuita
                </motion.a>
                <motion.a
                  href="/about"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blood-700 text-white rounded-lg font-semibold hover:bg-blood-800 transition-colors border-2 border-white/30"
                >
                  Conocer Nuestro Equipo
                </motion.a>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </AppContainer>
  );
}
