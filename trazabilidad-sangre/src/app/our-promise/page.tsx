'use client';

import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import { motion } from "framer-motion";
import Image from "next/image";
import "./../globals.css";

export default function OurPromise() {
  const promises = [
    {
      title: "Fast Delivery ⚡",
      description: "Garantizamos entregas rápidas y eficientes de productos sanguíneos a través de nuestra red optimizada de distribución. Nuestra tecnología blockchain permite coordinar el transporte en tiempo real, reduciendo tiempos de espera críticos.",
      image: "/images/content/promises/fast-delivery.webp",
      icon: "⚡",
      stats: [
        { label: "Tiempo promedio", value: "< 2h" },
        { label: "Entregas urgentes", value: "24/7" },
        { label: "Cobertura", value: "100%" }
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Secure Tracking 🔒",
      description: "Cada unidad de sangre y derivado está protegida por blockchain inmutable. Registramos temperatura, ubicación y manipulación en cada punto de la cadena de suministro, garantizando integridad total del producto.",
      image: "/images/content/promises/secure-tracking.webp",
      icon: "🔒",
      stats: [
        { label: "Registros inmutables", value: "100%" },
        { label: "Auditorías", value: "Real-time" },
        { label: "Certificación", value: "ISO 27001" }
      ],
      color: "from-primary-500 to-primary-700"
    },
    {
      title: "Real-time Updates 🔄",
      description: "Actualizaciones instantáneas sobre el estado de tus productos. Notificaciones automáticas para eventos críticos como cambios de temperatura, llegadas programadas y confirmaciones de entrega mediante smart contracts.",
      image: "/images/content/promises/realtime-updates.webp",
      icon: "🔄",
      stats: [
        { label: "Latencia", value: "< 3 seg" },
        { label: "Notificaciones", value: "Instantáneas" },
        { label: "Uptime", value: "99.9%" }
      ],
      color: "from-success-500 to-green-600"
    },
    {
      title: "Easy to Use 🎯",
      description: "Interfaz intuitiva diseñada para profesionales de la salud. Sin necesidad de conocimientos técnicos de blockchain: nuestra plataforma abstrae la complejidad y ofrece una experiencia simple y directa.",
      image: "/images/content/promises/easy-to-use.webp",
      icon: "🎯",
      stats: [
        { label: "Onboarding", value: "< 10 min" },
        { label: "Satisfacción", value: "4.8/5" },
        { label: "Soporte", value: "24/7" }
      ],
      color: "from-blue-500 to-indigo-600"
    }
  ];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Nuestro Compromiso Contigo"
          subtitle="4 promesas fundamentales que guían cada interacción en nuestra plataforma"
          height="md"
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Más que Tecnología: Es Confianza
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En el manejo de productos sanguíneos, cada segundo cuenta y cada detalle importa.
              Por eso nos comprometemos con estos cuatro pilares fundamentales.
            </p>
          </motion.div>

          {/* Promises Grid */}
          <div className="space-y-32">
            {promises.map((promise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-12`}
              >
                {/* Image Section with Parallax Effect */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full lg:w-1/2 h-80 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={promise.image}
                    alt={promise.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${promise.color} opacity-20`} />

                  {/* Icon Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br ${promise.color} shadow-xl flex items-center justify-center text-4xl`}
                  >
                    {promise.icon}
                  </motion.div>
                </motion.div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {promise.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {promise.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-6">
                    {promise.stats.map((stat, statIndex) => (
                      <motion.div
                        key={statIndex}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: statIndex * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
                      >
                        <div className={`text-2xl font-bold bg-gradient-to-r ${promise.color} bg-clip-text text-transparent mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 px-4 bg-gradient-to-r from-primary-600 via-primary-500 to-success-500 text-white mt-24"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-6"
            >
              🤝
            </motion.div>
            <h2 className="text-4xl font-bold mb-6">
              Comprometidos con la Excelencia
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Estas promesas no son solo palabras: están respaldadas por nuestra tecnología blockchain,
              certificaciones internacionales y el testimonio de más de 120 instituciones que confían en nosotros.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold">500K+</div>
                <div className="text-sm opacity-80">Donaciones Procesadas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm opacity-80">Países</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm opacity-80">Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm opacity-80">Satisfacción</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para Experimentar la Diferencia?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a la red de instituciones que ya confían en nuestra plataforma
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/registro"
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Comenzar Ahora
              </a>
              <a
                href="/company"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                Conocer Más
              </a>
            </div>
          </div>
        </section>
      </div>
    </AppContainer>
  );
}
