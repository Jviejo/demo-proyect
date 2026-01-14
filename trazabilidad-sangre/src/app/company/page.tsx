'use client';

import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import StatsGrid from "@/components/content/StatsGrid";
import ServiceCard from "@/components/content/ServiceCard";
import Timeline from "@/components/content/Timeline";
import ValueCard from "@/components/content/ValueCard";
import "./../globals.css";

export default function Company() {
  const stats = [
    { label: "Años de Experiencia", value: "15+", icon: "📅" },
    { label: "Donaciones Procesadas", value: "500K+", icon: "🩸" },
    { label: "Centros Conectados", value: "120+", icon: "🏥" },
    { label: "Países Activos", value: "25+", icon: "🌍" }
  ];

  const services = [
    {
      title: "Trazabilidad Blockchain",
      description: "Sistema inmutable de registro y seguimiento de cada unidad de sangre desde la donación hasta el uso final.",
      features: ["Registro en blockchain", "Trazabilidad completa", "Inmutable y transparente"],
      icon: "🔗"
    },
    {
      title: "Gestión de Derivados",
      description: "Procesamiento, etiquetado y seguimiento de plasma, eritrocitos y plaquetas con NFTs únicos.",
      features: ["Tokenización NFT", "Seguimiento individual", "Metadata completa"],
      icon: "🧬"
    },
    {
      title: "Marketplace Seguro",
      description: "Plataforma descentralizada para intercambio de derivados sanguíneos entre entidades certificadas.",
      features: ["Transacciones seguras", "Verificación de entidades", "Contratos inteligentes"],
      icon: "🛡️"
    }
  ];

  const ethicsTimeline = [
    {
      title: "Transparencia Total",
      description: "Todos los procesos son auditables y verificables en tiempo real mediante blockchain.",
      icon: "👁️"
    },
    {
      title: "Seguridad y Privacidad",
      description: "Cumplimiento estricto de GDPR y normativas de protección de datos sensibles.",
      icon: "🔒"
    },
    {
      title: "Calidad Certificada",
      description: "Estándares ISO 9001 y conformidad con directivas europeas de hemoderivados.",
      icon: "✅"
    },
    {
      title: "Impacto Social",
      description: "Contribución a salvar vidas mediante optimización de recursos sanguíneos.",
      icon: "❤️"
    }
  ];

  const values = [
    {
      title: "Innovación Tecnológica",
      description: "Utilizamos blockchain y tecnología NFT para revolucionar la gestión de productos sanguíneos. Nuestra plataforma es la primera en Europa en combinar Ethereum con trazabilidad hospitalaria.",
      imageUrl: "/images/content/company/values-2.webp",
      position: "left" as const
    },
    {
      title: "Confianza y Seguridad",
      description: "Cada transacción queda registrada de forma inmutable. Los contratos inteligentes garantizan el cumplimiento automático de normativas y protocolos de seguridad sin intervención manual.",
      imageUrl: "/images/content/company/lab.webp",
      position: "right" as const
    },
    {
      title: "Excelencia Operativa",
      description: "Nuestro equipo multidisciplinar combina experiencia médica, blockchain y desarrollo de software para ofrecer soluciones robustas que cumplen los más altos estándares de calidad.",
      imageUrl: "/images/content/company/values-1.webp",
      position: "left" as const
    },
    {
      title: "Sostenibilidad",
      description: "Optimizamos recursos reduciendo pérdidas y desperdicios. Nuestro sistema ha ayudado a reducir en un 35% el descarte de productos sanguíneos por caducidad o pérdida de trazabilidad.",
      imageUrl: "/images/content/company/values-1.webp",
      position: "right" as const
    }
  ];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Transformando la Trazabilidad de Productos Sanguíneos"
          subtitle="Blockchain, NFTs y tecnología de vanguardia al servicio de la salud pública"
          backgroundImage="/images/content/company/hero.webp"
          ctaText="Conoce Nuestros Servicios"
          ctaLink="#services"
        />

        {/* Quiénes Somos */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiénes Somos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos pioneros en la aplicación de blockchain para la gestión de productos sanguíneos.
              Fundada en 2018, nuestra misión es garantizar la seguridad, trazabilidad y optimización
              de cada unidad de sangre y sus derivados.
            </p>
          </div>

          <StatsGrid stats={stats} />

          <div className="mt-12 text-center max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Trabajamos con más de 120 centros de donación, laboratorios y hospitales en 25 países,
              procesando más de 500,000 donaciones anuales mediante nuestra plataforma blockchain.
              Nuestro sistema ha sido certificado bajo normativas ISO 9001 y cumple con todas las
              directivas europeas de hemoderivados.
            </p>
          </div>
        </section>

        {/* Qué Hacemos */}
        <section id="services" className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Qué Hacemos</h2>
              <p className="text-xl text-gray-600">
                Nuestras soluciones integran tecnología blockchain con procesos clínicos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  icon={service.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Nuestra Ética */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Ética</h2>
            <p className="text-xl text-gray-600">
              Principios que guían cada decisión y acción en nuestra organización
            </p>
          </div>

          <Timeline items={ethicsTimeline} />
        </section>

        {/* Nuestros Valores */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
              <p className="text-xl text-gray-600">
                Los pilares que sostienen nuestra visión y misión
              </p>
            </div>

            <div className="space-y-24">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  title={value.title}
                  description={value.description}
                  imageUrl={value.imageUrl}
                  position={value.position}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Quieres formar parte de la revolución?</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a nuestra red de centros certificados y transforma la gestión de productos sanguíneos
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/registro"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Registrar mi Centro
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-white/20"
              >
                Contactar Ventas
              </a>
            </div>
          </div>
        </section>
      </div>
    </AppContainer>
  );
}
