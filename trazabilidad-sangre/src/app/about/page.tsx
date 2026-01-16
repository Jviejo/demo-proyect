'use client';

import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import StatsGrid from "@/components/content/StatsGrid";
import ServiceCard from "@/components/content/ServiceCard";
import Timeline from "@/components/content/Timeline";
import ValueCard from "@/components/content/ValueCard";
import TeamMemberCard from "@/components/content/TeamMemberCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import "./../globals.css";

export default function About() {
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

  const teamMembers = [
    // Leadership
    {
      name: "Dra. María Fernández",
      role: "CEO & Co-founder",
      department: "Leadership",
      bio: "Hematóloga con 20 años de experiencia en bancos de sangre. Pionera en la implementación de blockchain en sistemas hospitalarios. Doctorado en Medicina por la Universidad Complutense de Madrid.",
      initials: "MF",
      linkedin: "https://linkedin.com/in/maria-fernandez-ceo",
      gradient: "from-blood-500 to-blood-600"
    },
    {
      name: "Dr. Carlos Ramírez",
      role: "CTO & Co-founder",
      department: "Leadership",
      bio: "Ingeniero de Software especializado en blockchain y contratos inteligentes. Ex-líder técnico en Consensys. Máster en Distributed Systems por ETH Zürich.",
      initials: "CR",
      linkedin: "https://linkedin.com/in/carlos-ramirez-cto",
      gradient: "from-blockchain-500 to-blockchain-600"
    },
    // Desarrollo
    {
      name: "Ana López",
      role: "Lead Blockchain Developer",
      department: "Desarrollo",
      bio: "Experta en Solidity y Foundry. Contribuidora activa en proyectos open-source de Ethereum. 8 años en desarrollo de dApps y smart contracts auditados.",
      initials: "AL",
      linkedin: "https://linkedin.com/in/ana-lopez-blockchain",
      gradient: "from-purple-500 to-blockchain-500"
    },
    {
      name: "Javier Martínez",
      role: "Senior Frontend Engineer",
      department: "Desarrollo",
      bio: "Especialista en Next.js y React. Arquitecto de interfaces para aplicaciones Web3. Certificación en UX/UI y Accesibilidad Web.",
      initials: "JM",
      linkedin: "https://linkedin.com/in/javier-martinez-frontend",
      gradient: "from-blockchain-600 to-purple-600"
    },
    {
      name: "Laura García",
      role: "Backend Engineer",
      department: "Desarrollo",
      bio: "Ingeniera de sistemas con expertise en APIs escalables y microservicios. Especializada en integración de oráculos blockchain y sistemas legacy.",
      initials: "LG",
      linkedin: "https://linkedin.com/in/laura-garcia-backend",
      gradient: "from-medical-600 to-green-600"
    },
    // Operaciones
    {
      name: "Dr. Roberto Sánchez",
      role: "Medical Advisor",
      department: "Operaciones",
      bio: "Director médico de laboratorio clínico con certificaciones ISO 15189. Asesor regulatorio en normativas europeas de hemoderivados y trazabilidad.",
      initials: "RS",
      linkedin: "https://linkedin.com/in/roberto-sanchez-medical",
      gradient: "from-blood-500 to-medical-500"
    },
    {
      name: "Elena Torres",
      role: "Operations Manager",
      department: "Operaciones",
      bio: "Gestión operativa de redes hospitalarias. 12 años en logística de productos biológicos. Especialista en cadena de frío y compliance normativo.",
      initials: "ET",
      linkedin: "https://linkedin.com/in/elena-torres-operations",
      gradient: "from-medical-500 to-blockchain-500"
    },
    {
      name: "Miguel Jiménez",
      role: "Quality Assurance Lead",
      department: "Operaciones",
      bio: "Auditor certificado ISO 9001 y 27001. Responsable de testing automatizado, seguridad de contratos inteligentes y procesos de validación regulatoria.",
      initials: "MJ",
      linkedin: "https://linkedin.com/in/miguel-jimenez-qa",
      gradient: "from-purple-600 to-medical-600"
    }
  ];

  const departmentCounts = {
    Leadership: teamMembers.filter(m => m.department === "Leadership").length,
    Desarrollo: teamMembers.filter(m => m.department === "Desarrollo").length,
    Operaciones: teamMembers.filter(m => m.department === "Operaciones").length
  };

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Sobre Nosotros"
          subtitle="Transformando la trazabilidad de productos sanguíneos con blockchain y tecnología de vanguardia"
          backgroundImage="/images/content/company/hero.webp"
          ctaText="Conoce Nuestros Servicios"
          ctaLink="#services"
        />

        {/* Quiénes Somos */}
        <Section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Quiénes Somos</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Somos pioneros en la aplicación de blockchain para la gestión de productos sanguíneos.
                Fundada en 2018, nuestra misión es garantizar la seguridad, trazabilidad y optimización
                de cada unidad de sangre y sus derivados.
              </p>
            </div>

            <StatsGrid stats={stats} />

            <div className="mt-12 text-center max-w-4xl mx-auto">
              <p className="text-lg text-slate-700 leading-relaxed">
                Trabajamos con más de 120 centros de donación, laboratorios y hospitales en 25 países,
                procesando más de 500,000 donaciones anuales mediante nuestra plataforma blockchain.
                Nuestro sistema ha sido certificado bajo normativas ISO 9001 y cumple con todas las
                directivas europeas de hemoderivados.
              </p>
            </div>
          </Container>
        </Section>

        {/* Qué Hacemos */}
        <Section id="services" className="py-16 bg-slate-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Qué Hacemos</h2>
              <p className="text-xl text-slate-600">
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
          </Container>
        </Section>

        {/* Nuestra Ética */}
        <Section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestra Ética</h2>
              <p className="text-xl text-slate-600">
                Principios que guían cada decisión y acción en nuestra organización
              </p>
            </div>

            <Timeline items={ethicsTimeline} />
          </Container>
        </Section>

        {/* Nuestros Valores */}
        <Section className="py-16 bg-gradient-to-b from-white to-slate-50">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestros Valores</h2>
              <p className="text-xl text-slate-600">
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
          </Container>
        </Section>

        {/* Nuestro Equipo */}
        <Section className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestro Equipo</h2>
              <p className="text-xl text-slate-600">
                Un equipo multidisciplinar de expertos en medicina, blockchain y tecnología
              </p>
            </div>

            {/* Team Stats */}
            <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <div className="text-4xl font-bold text-blood-600 mb-2">
                  {departmentCounts.Leadership}
                </div>
                <div className="text-slate-600 font-medium">Leadership</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <div className="text-4xl font-bold text-blockchain-600 mb-2">
                  {departmentCounts.Desarrollo}
                </div>
                <div className="text-slate-600 font-medium">Desarrollo</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <div className="text-4xl font-bold text-medical-600 mb-2">
                  {departmentCounts.Operaciones}
                </div>
                <div className="text-slate-600 font-medium">Operaciones</div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Leadership Team */}
        <Section className="py-16 px-4">
          <Container>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Leadership</h3>
              <p className="text-slate-600">Líderes visionarios con experiencia médica y tecnológica</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers
                .filter(member => member.department === "Leadership")
                .map((member, index) => (
                  <TeamMemberCard
                    key={index}
                    name={member.name}
                    role={member.role}
                    bio={member.bio}
                    avatarUrl=""
                    initials={member.initials}
                    gradient={member.gradient}
                    linkedin={member.linkedin}
                  />
                ))}
            </div>
          </Container>
        </Section>

        {/* Development Team */}
        <Section className="py-16 px-4 bg-slate-50">
          <Container>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Desarrollo</h3>
              <p className="text-slate-600">Ingenieros expertos en blockchain y aplicaciones web</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers
                .filter(member => member.department === "Desarrollo")
                .map((member, index) => (
                  <TeamMemberCard
                    key={index}
                    name={member.name}
                    role={member.role}
                    bio={member.bio}
                    avatarUrl=""
                    initials={member.initials}
                    gradient={member.gradient}
                    linkedin={member.linkedin}
                  />
                ))}
            </div>
          </Container>
        </Section>

        {/* Operations Team */}
        <Section className="py-16 px-4">
          <Container>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Operaciones</h3>
              <p className="text-slate-600">Especialistas en gestión hospitalaria y calidad</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers
                .filter(member => member.department === "Operaciones")
                .map((member, index) => (
                  <TeamMemberCard
                    key={index}
                    name={member.name}
                    role={member.role}
                    bio={member.bio}
                    avatarUrl=""
                    initials={member.initials}
                    gradient={member.gradient}
                    linkedin={member.linkedin}
                  />
                ))}
            </div>
          </Container>
        </Section>

        {/* CTA Final - Únete */}
        <Section className="py-16 px-4 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">¿Quieres formar parte de la revolución?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Únete a nuestra red de centros certificados o forma parte de nuestro equipo de expertos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/role-registro"
                  className="px-8 py-3 bg-white text-blood-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Registrar mi Centro
                </a>
                <a
                  href="/careers"
                  className="px-8 py-3 bg-blood-700 text-white rounded-lg font-semibold hover:bg-blood-800 transition-colors border border-white/20"
                >
                  Ver Vacantes
                </a>
                <a
                  href="/get-in-touch"
                  className="px-8 py-3 bg-blockchain-700 text-white rounded-lg font-semibold hover:bg-blockchain-800 transition-colors border border-white/20"
                >
                  Contactar
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </AppContainer>
  );
}
