'use client';

import React, { useState, useMemo } from 'react';
import { AppContainer } from "../layout";
import NewsItem from "@/components/content/NewsItem";
import { motion } from 'framer-motion';
import "./../globals.css";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'update' | 'regulatory' | 'partnership' | 'event';
  image?: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Nueva versión 2.0 del sistema de trazabilidad blockchain",
    description: "Lanzamos mejoras significativas en velocidad de procesamiento y nuevas funcionalidades de reporting para cumplir con las últimas normativas europeas de trazabilidad de productos sanguíneos.",
    date: "2026-01-10",
    category: "update",
    image: "/images/content/news/news-1.webp"
  },
  {
    id: 2,
    title: "Nuevas normativas EU sobre trazabilidad de sangre entran en vigor",
    description: "La Unión Europea aprueba regulación que obliga a todos los centros de donación a implementar sistemas de trazabilidad digital completa antes de 2027. Nuestro sistema ya cumple todos los requisitos.",
    date: "2026-01-05",
    category: "regulatory",
    image: "/images/content/news/news-2.webp"
  },
  {
    id: 3,
    title: "Partnership estratégico con Red Europea de Bancos de Sangre",
    description: "Firmamos acuerdo de colaboración con la Red Europea de Bancos de Sangre para integrar 150+ centros de donación en España, Francia y Portugal bajo una única plataforma blockchain.",
    date: "2025-12-28",
    category: "partnership",
    image: "/images/content/news/news-3.webp"
  },
  {
    id: 4,
    title: "Webinar gratuito: Implementación de blockchain en hospitales",
    description: "Próximo webinar el 25 de enero donde expertos compartirán casos de éxito y mejores prácticas para implementar sistemas de trazabilidad blockchain en instituciones médicas. Inscripciones abiertas.",
    date: "2025-12-20",
    category: "event",
    image: "/images/content/news/news-4.webp"
  },
  {
    id: 5,
    title: "Integración con sistema nacional de salud español",
    description: "Nuestro sistema se integra oficialmente con la base de datos del Sistema Nacional de Salud de España, permitiendo interoperabilidad completa entre hospitales públicos y privados.",
    date: "2025-12-15",
    category: "update",
    image: "/images/content/news/news-5.webp"
  },
  {
    id: 6,
    title: "ISO 27001 y certificaciones de seguridad completadas",
    description: "Completamos auditoría y obtenemos certificación ISO 27001 para seguridad de la información, además de certificaciones GDPR y SOC 2 Type II, garantizando los más altos estándares de seguridad.",
    date: "2025-12-10",
    category: "regulatory"
  },
  {
    id: 7,
    title: "Partnership con Asociación Española de Hematología",
    description: "Colaboración estratégica para desarrollar protocolos clínicos específicos y capacitar al personal médico en el uso de tecnologías blockchain aplicadas a la gestión de productos sanguíneos.",
    date: "2025-12-01",
    category: "partnership"
  },
  {
    id: 8,
    title: "Conferencia internacional Blood Tech Summit 2026",
    description: "Participaremos como speakers principales en Blood Tech Summit 2026 en Barcelona, presentando casos de uso de blockchain en trazabilidad sanguínea ante 500+ profesionales del sector.",
    date: "2025-11-25",
    category: "event"
  },
  {
    id: 9,
    title: "Actualización protocolo Smart Contracts v3.5",
    description: "Desplegamos nueva versión de smart contracts con optimizaciones de gas fee reduciendo costos de transacción en 40% y mejorando tiempos de confirmación en redes de capa 2.",
    date: "2025-11-15",
    category: "update"
  },
  {
    id: 10,
    title: "Nueva alianza con ministerios de salud de Latinoamérica",
    description: "Firmamos acuerdos con ministerios de salud de México, Colombia y Argentina para pilotos de implementación de trazabilidad blockchain en sistemas públicos de donación de sangre.",
    date: "2025-11-05",
    category: "partnership"
  }
];

const ITEMS_PER_PAGE = 5;

const categoryLabels: Record<string, string> = {
  all: 'Todas las categorías',
  update: 'Actualizaciones',
  regulatory: 'Normativas',
  partnership: 'Partners',
  event: 'Eventos'
};

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredNews = useMemo(() => {
    let filtered = newsArticles;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(query) ||
        news.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const categories = ['all', 'update', 'regulatory', 'partnership', 'event'];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Noticias y{' '}
              <span className="text-primary-600">Actualizaciones</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mantente informado sobre las últimas novedades, actualizaciones del sistema,
              normativas y eventos del sector de trazabilidad de productos sanguíneos
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar noticias por título o contenido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors shadow-md"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-gray-600"
          >
            {filteredNews.length} {filteredNews.length === 1 ? 'noticia encontrada' : 'noticias encontradas'}
            {searchQuery && (
              <span className="ml-2">
                para &quot;<strong>{searchQuery}</strong>&quot;
              </span>
            )}
          </motion.div>

          {/* News Timeline */}
          <div className="space-y-6 mb-12">
            {paginatedNews.length > 0 ? (
              paginatedNews.map((news, index) => (
                <NewsItem
                  key={news.id}
                  title={news.title}
                  description={news.description}
                  date={news.date}
                  category={news.category}
                  image={news.image}
                  index={index}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No se encontraron noticias
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `No hay noticias que coincidan con "${searchQuery}"`
                    : 'No hay noticias en esta categoría'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas las noticias
                </button>
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                }`}
              >
                ← Anterior
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                }`}
              >
                Siguiente →
              </button>
            </motion.div>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl p-12 text-white text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">
              📬 Suscríbete a nuestro Newsletter
            </h2>
            <p className="text-lg mb-6 text-primary-50 max-w-2xl mx-auto">
              Recibe las últimas noticias, actualizaciones y eventos directamente en tu correo.
              Sin spam, solo información relevante del sector.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu-email@ejemplo.com"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={() => alert('Funcionalidad de newsletter próximamente')}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Suscribirse
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </AppContainer>
  );
}
