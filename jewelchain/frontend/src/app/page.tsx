'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { connect, isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="navbar bg-base-100 fixed top-0 z-50 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="#caracteristicas">Características</a></li>
              <li><a href="#roles">Roles</a></li>
              <li><a href="#seguridad">Seguridad</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">JewelChain</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="#caracteristicas">Características</a></li>
            <li><a href="#roles">Roles</a></li>
            <li><a href="#seguridad">Seguridad</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-primary" onClick={connect}>
              Iniciar sesión
            </button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="hero min-h-screen bg-base-200 pt-16 relative"
        style={{
          backgroundImage: 'url("/images/cover-section.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="hero-content flex-col lg:flex-row-reverse relative z-10">
          <Image
            src="/images/hero-jewelry.jpeg"
            alt="Joyas en blockchain"
            width={500}
            height={500}
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold text-white">Garantiza la autenticidad de tus joyas y piedras preciosas</h1>
            <p className="py-6 text-white">Un sistema de trazabilidad transparente que defiende la integridad ética y la autenticidad en cada paso.</p>
            <button className="btn btn-primary" onClick={connect}>
            Empieza Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="caracteristicas" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Un sistema de confianza, paso a paso</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Extracción de Materiales",
                description: "Registra el origen y autenticidad desde la mina",
                icon: "🏗️"
              },
              {
                title: "Fabricación",
                description: "Documenta el uso de materiales con transparencia",
                icon: "⚒️"
              },
              {
                title: "Distribución",
                description: "Cada traslado está verificado en blockchain",
                icon: "🚚"
              },
              {
                title: "Venta al Cliente",
                description: "Acceso a la historia completa del producto",
                icon: "🏪"
              }
            ].map((step, index) => (
              <div key={index} className="card bg-base-200 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="card-title">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles y Beneficios */}
      <section id="roles" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Para cada actor en la cadena de valor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Minero",
                description: "Registra y certifica el origen de las piedras preciosas y materiales, garantizando su procedencia ética.",
                icon: "⛏️",
                benefits: ["Certificación de origen", "Trazabilidad completa", "Valor agregado"]
              },
              {
                title: "Fabricante",
                description: "Documenta el proceso de fabricación y garantiza la calidad de los materiales utilizados.",
                icon: "🏭",
                benefits: ["Control de calidad", "Registro de procesos", "Certificación de autenticidad"]
              },
              {
                title: "Distribuidor",
                description: "Mantiene la cadena de custodia y verifica cada movimiento en la blockchain.",
                icon: "🚛",
                benefits: ["Seguimiento en tiempo real", "Verificación de autenticidad", "Gestión de inventario"]
              },
              {
                title: "Tienda",
                description: "Ofrece transparencia total y garantía de autenticidad a sus clientes.",
                icon: "🏪",
                benefits: ["Confianza del cliente", "Diferenciación", "Valor añadido"]
              },
              {
                title: "Cliente Final",
                description: "Accede a la historia completa de su joya y verifica su autenticidad.",
                icon: "👤",
                benefits: ["Garantía de autenticidad", "Historia completa", "Valor de reventa"]
              },
              {
                title: "Certificador",
                description: "Valida y certifica la calidad y autenticidad en cada etapa del proceso.",
                icon: "✅",
                benefits: ["Proceso automatizado", "Registros inmutables", "Certificación digital"]
              }
            ].map((role, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <div className="text-4xl mb-4 text-center">{role.icon}</div>
                  <h3 className="card-title justify-center mb-4">{role.title}</h3>
                  <p className="text-center mb-4">{role.description}</p>
                  <div className="divider">Beneficios</div>
                  <ul className="list-none space-y-2">
                    {role.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad Section */}
      <section id="seguridad" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Seguridad de última generación en Blockchain</h2>
          <div className="card lg:card-side bg-base-200 shadow-xl">
            <figure className="p-6">
              <Image
                src="/images/security.jpeg"
                alt="Seguridad Blockchain"
                width={300}
                height={300}
                className="rounded-xl"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Tecnología Blockchain de Polygon</h3>
              <p>Utilizamos la red Polygon para garantizar la máxima seguridad y transparencia en cada transacción.</p>
              <div className="card-actions justify-end">
                <Link href="/seguridad" className="btn btn-primary">Saber más</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <div>
          <span className="footer-title">Servicios</span>
          <a className="link link-hover">Trazabilidad</a>
          <a className="link link-hover">Certificación</a>
          <a className="link link-hover">Verificación</a>
        </div>
        <div>
          <span className="footer-title">Compañía</span>
          <a className="link link-hover">Sobre nosotros</a>
          <a className="link link-hover">Contacto</a>
          <a className="link link-hover">Empleos</a>
        </div>
        <div>
          <span className="footer-title">Legal</span>
          <a className="link link-hover">Términos de uso</a>
          <a className="link link-hover">Política de privacidad</a>
        </div>
      </footer>
    </div>
  );
}
