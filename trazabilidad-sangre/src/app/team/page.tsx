'use client';

import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import TeamMemberCard from "@/components/content/TeamMemberCard";
import "./../globals.css";

export default function Team() {
  const teamMembers = [
    // Leadership
    {
      name: "Dra. María Fernández",
      role: "CEO & Co-founder",
      department: "Leadership",
      bio: "Hematóloga con 20 años de experiencia en bancos de sangre. Pionera en la implementación de blockchain en sistemas hospitalarios. Doctorado en Medicina por la Universidad Complutense de Madrid.",
      initials: "MF",
      linkedin: "https://linkedin.com/in/maria-fernandez-ceo",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      name: "Dr. Carlos Ramírez",
      role: "CTO & Co-founder",
      department: "Leadership",
      bio: "Ingeniero de Software especializado en blockchain y contratos inteligentes. Ex-líder técnico en Consensys. Máster en Distributed Systems por ETH Zürich.",
      initials: "CR",
      linkedin: "https://linkedin.com/in/carlos-ramirez-cto",
      gradient: "from-success-500 to-success-600"
    },
    // Desarrollo
    {
      name: "Ana López",
      role: "Lead Blockchain Developer",
      department: "Desarrollo",
      bio: "Experta en Solidity y Foundry. Contribuidora activa en proyectos open-source de Ethereum. 8 años en desarrollo de dApps y smart contracts auditados.",
      initials: "AL",
      linkedin: "https://linkedin.com/in/ana-lopez-blockchain",
      gradient: "from-purple-500 to-primary-500"
    },
    {
      name: "Javier Martínez",
      role: "Senior Frontend Engineer",
      department: "Desarrollo",
      bio: "Especialista en Next.js y React. Arquitecto de interfaces para aplicaciones Web3. Certificación en UX/UI y Accesibilidad Web.",
      initials: "JM",
      linkedin: "https://linkedin.com/in/javier-martinez-frontend",
      gradient: "from-primary-600 to-purple-600"
    },
    {
      name: "Laura García",
      role: "Backend Engineer",
      department: "Desarrollo",
      bio: "Ingeniera de sistemas con expertise en APIs escalables y microservicios. Especializada en integración de oráculos blockchain y sistemas legacy.",
      initials: "LG",
      linkedin: "https://linkedin.com/in/laura-garcia-backend",
      gradient: "from-success-600 to-green-600"
    },
    // Operaciones
    {
      name: "Dr. Roberto Sánchez",
      role: "Medical Advisor",
      department: "Operaciones",
      bio: "Director médico de laboratorio clínico con certificaciones ISO 15189. Asesor regulatorio en normativas europeas de hemoderivados y trazabilidad.",
      initials: "RS",
      linkedin: "https://linkedin.com/in/roberto-sanchez-medical",
      gradient: "from-primary-500 to-success-500"
    },
    {
      name: "Elena Torres",
      role: "Operations Manager",
      department: "Operaciones",
      bio: "Gestión operativa de redes hospitalarias. 12 años en logística de productos biológicos. Especialista en cadena de frío y compliance normativo.",
      initials: "ET",
      linkedin: "https://linkedin.com/in/elena-torres-operations",
      gradient: "from-success-500 to-primary-500"
    },
    {
      name: "Miguel Jiménez",
      role: "Quality Assurance Lead",
      department: "Operaciones",
      bio: "Auditor certificado ISO 9001 y 27001. Responsable de testing automatizado, seguridad de contratos inteligentes y procesos de validación regulatoria.",
      initials: "MJ",
      linkedin: "https://linkedin.com/in/miguel-jimenez-qa",
      gradient: "from-purple-600 to-success-600"
    }
  ];

  const departmentCounts = {
    Leadership: teamMembers.filter(m => m.department === "Leadership").length,
    Desarrollo: teamMembers.filter(m => m.department === "Desarrollo").length,
    Operaciones: teamMembers.filter(m => m.department === "Operaciones").length
  };

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Nuestro Equipo"
          subtitle="Un equipo multidisciplinar de expertos en medicina, blockchain y tecnología"
          backgroundImage="/images/content/team/team-hero.webp"
        />

        {/* Team Stats */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {departmentCounts.Leadership}
              </div>
              <div className="text-gray-600 font-medium">Leadership</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="text-4xl font-bold text-success-600 mb-2">
                {departmentCounts.Desarrollo}
              </div>
              <div className="text-gray-600 font-medium">Desarrollo</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {departmentCounts.Operaciones}
              </div>
              <div className="text-gray-600 font-medium">Operaciones</div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Leadership</h2>
            <p className="text-gray-600">Líderes visionarios con experiencia médica y tecnológica</p>
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
        </section>

        {/* Development Team */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Desarrollo</h2>
              <p className="text-gray-600">Ingenieros expertos en blockchain y aplicaciones web</p>
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
          </div>
        </section>

        {/* Operations Team */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Operaciones</h2>
            <p className="text-gray-600">Especialistas en gestión hospitalaria y calidad</p>
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
        </section>

        {/* Join Us CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-success-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Quieres unirte al equipo?</h2>
            <p className="text-xl mb-8 opacity-90">
              Estamos buscando talento apasionado por blockchain, salud y tecnología
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/careers"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Vacantes
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-white/20"
              >
                Enviar CV Espontáneo
              </a>
            </div>
          </div>
        </section>
      </div>
    </AppContainer>
  );
}
