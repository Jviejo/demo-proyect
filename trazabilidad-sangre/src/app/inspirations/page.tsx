'use client';

import React, { useState } from 'react';
import { AppContainer } from "../layout";
import StoryCard from "@/components/content/StoryCard";
import { motion } from 'framer-motion';
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

const stories: Story[] = [
  {
    id: 1,
    title: "Hospital Universitario reduce pérdidas en un 40%",
    excerpt: "Gracias a la implementación de nuestro sistema de trazabilidad blockchain, el Hospital Universitario Central logró reducir las pérdidas de productos sanguíneos en un 40% durante el primer año. La transparencia total en la cadena de suministro permitió identificar puntos críticos y optimizar procesos.",
    image: "/images/content/inspirations/story-1.webp",
    category: "Casos de Éxito",
    date: "15 Enero 2026",
    author: "Dr. Carlos Méndez",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Laboratorio Regional: Trazabilidad completa en 30 días",
    excerpt: "El Laboratorio Regional de Barcelona implementó nuestro sistema completo en solo 30 días. Ahora procesan más de 500 unidades de sangre mensualmente con trazabilidad completa desde la donación hasta el paciente final, cumpliendo todas las normativas europeas de seguridad.",
    image: "/images/content/inspirations/story-2.webp",
    category: "Implementación",
    date: "10 Enero 2026",
    author: "Dra. María Rodríguez",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "Centro de Donación incrementa confianza de donantes",
    excerpt: "El Centro de Donación de Madrid reporta un incremento del 35% en donaciones recurrentes. Los donantes valoran poder rastrear en tiempo real cómo sus donaciones ayudan a pacientes, generando un vínculo emocional único y transparencia sin precedentes en el sector.",
    image: "/images/content/inspirations/story-3.webp",
    category: "Impacto Social",
    date: "5 Enero 2026",
    author: "Ana Martínez",
    readTime: "6 min"
  },
  {
    id: 4,
    title: "Blockchain garantiza autenticidad en cadena de frío",
    excerpt: "La implementación de smart contracts automatizó las alertas de temperatura crítica en tiempo real. Tres hospitales en Valencia evitaron pérdidas millonarias al detectar inmediatamente quiebres en la cadena de frío, garantizando la calidad de todos los productos.",
    image: "/images/content/inspirations/story-4.webp",
    category: "Tecnología",
    date: "28 Diciembre 2025",
    author: "Ing. Roberto Sánchez",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "Red de hospitales conectados salva vidas",
    excerpt: "Una red de 12 hospitales en Andalucía coordinó el intercambio de derivados sanguíneos escasos mediante nuestro marketplace descentralizado. En situaciones de emergencia, la disponibilidad inmediata de información salvó vidas al reducir tiempos de búsqueda en un 80%.",
    image: "/images/content/inspirations/story-5.webp",
    category: "Colaboración",
    date: "20 Diciembre 2025",
    author: "Dr. Javier López",
    readTime: "5 min"
  },
  {
    id: 6,
    title: "Paciente recupera salud gracias a trazabilidad transparente",
    excerpt: "María, paciente de 45 años con leucemia, recibió transfusiones de plaquetas con trazabilidad completa. Su familia pudo verificar el origen, procesamiento y calidad de cada unidad, brindando paz mental en momentos críticos. Hoy está en remisión completa.",
    image: "/images/content/inspirations/story-6.webp",
    category: "Historia Personal",
    date: "15 Diciembre 2025",
    author: "Laura García",
    readTime: "8 min"
  }
];

export default function Inspirations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(stories.map(s => s.category)))];

  // Filter stories
  const filteredStories = selectedCategory === "all"
    ? stories
    : stories.filter(s => s.category === selectedCategory);

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Historias de{' '}
              <span className="text-primary-600">Inspiración</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce cómo hospitales, laboratorios y centros de donación están transformando
              la gestión de productos sanguíneos con blockchain y salvando vidas en el proceso
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
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
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
            className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 mb-12 text-white shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">40%</div>
                <div className="text-primary-100">Reducción de pérdidas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-100">Unidades procesadas/mes</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="text-primary-100">Hospitales conectados</div>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No hay historias en esta categoría
              </h3>
              <p className="text-gray-600">
                Intenta seleccionar otra categoría para ver más historias
              </p>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-gradient-to-r from-success-500 to-success-600 rounded-2xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres ser la próxima historia de éxito?
            </h2>
            <p className="text-lg mb-6 text-success-50 max-w-2xl mx-auto">
              Únete a la revolución de la trazabilidad de productos sanguíneos.
              Implementa nuestro sistema y transforma tu organización.
            </p>
            <button
              onClick={() => alert('Redirigiendo a contacto...')}
              className="bg-white text-success-600 px-8 py-3 rounded-lg font-semibold hover:bg-success-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              Contacta con nosotros
            </button>
          </motion.div>

        </div>
      </div>
    </AppContainer>
  );
}
