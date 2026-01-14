'use client';

import { AppContainer } from "../layout";
import "./../globals.css";
import { motion } from 'framer-motion';
import { useState } from 'react';
import DocumentItem from "@/components/content/DocumentItem";
import HeroSection from "@/components/content/HeroSection";

type DocumentType = 'pdf' | 'doc' | 'xls' | 'ppt' | 'other';

interface Document {
  title: string;
  description: string;
  type: DocumentType;
  size: string;
  date: string;
  category: 'BOE' | 'GDPR' | 'Certificaciones' | 'Otros';
}

export default function Docus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // BOE Documents
  const boeDocuments: Document[] = [
    {
      title: "RD 1088/2005 - Requisitos técnicos y condiciones mínimas de la hemodonación",
      description: "Real Decreto que establece los requisitos técnicos y condiciones mínimas de la hemodonación y de los centros y servicios de transfusión.",
      type: 'pdf',
      size: '2.3 MB',
      date: '2005-09-16',
      category: 'BOE'
    },
    {
      title: "Directiva 2002/98/CE - Normas de calidad y seguridad en sangre humana",
      description: "Directiva europea sobre normas de calidad y seguridad para la extracción, verificación, tratamiento, almacenamiento y distribución de sangre humana y sus componentes.",
      type: 'pdf',
      size: '1.8 MB',
      date: '2003-02-08',
      category: 'BOE'
    },
    {
      title: "Ley 14/2007 - Investigación biomédica con muestras biológicas",
      description: "Ley de Investigación biomédica que regula la obtención y utilización de muestras biológicas de origen humano con fines de investigación.",
      type: 'pdf',
      size: '3.1 MB',
      date: '2007-07-04',
      category: 'BOE'
    },
    {
      title: "RD 1723/2012 - Regulación de biobancos con fines de investigación",
      description: "Real Decreto sobre actividades de obtención, utilización clínica y coordinación territorial de los órganos humanos y las donaciones.",
      type: 'pdf',
      size: '1.5 MB',
      date: '2012-12-28',
      category: 'BOE'
    },
    {
      title: "Guía de Buenas Prácticas de Manufactura - Productos Sanguíneos",
      description: "Documento técnico que establece las directrices de buenas prácticas de manufactura (GMP) aplicables a productos sanguíneos y derivados.",
      type: 'pdf',
      size: '4.2 MB',
      date: '2020-06-15',
      category: 'BOE'
    }
  ];

  // GDPR & Security Documents
  const securityDocuments: Document[] = [
    {
      title: "GDPR Compliance Guide - Blood Traceability Systems",
      description: "Guía completa de cumplimiento del Reglamento General de Protección de Datos (GDPR) aplicada a sistemas de trazabilidad de productos sanguíneos en blockchain.",
      type: 'pdf',
      size: '3.5 MB',
      date: '2024-01-20',
      category: 'GDPR'
    },
    {
      title: "Análisis de Impacto de Protección de Datos (DPIA)",
      description: "Evaluación de impacto de protección de datos (DPIA) para el sistema de trazabilidad blockchain de productos sanguíneos, según requerimientos del GDPR.",
      type: 'pdf',
      size: '2.1 MB',
      date: '2024-03-10',
      category: 'GDPR'
    },
    {
      title: "ISO 27001:2022 - Certificado de Seguridad de la Información",
      description: "Certificado ISO 27001:2022 que acredita el cumplimiento de estándares internacionales de seguridad de la información en sistemas de gestión.",
      type: 'pdf',
      size: '0.8 MB',
      date: '2024-05-15',
      category: 'Certificaciones'
    },
    {
      title: "ENS - Esquema Nacional de Seguridad (Nivel Alto)",
      description: "Certificación de cumplimiento del Esquema Nacional de Seguridad (ENS) en categoría ALTA para infraestructuras críticas de datos sanitarios.",
      type: 'pdf',
      size: '1.2 MB',
      date: '2024-07-01',
      category: 'Certificaciones'
    }
  ];

  // All documents
  const allDocuments = [...boeDocuments, ...securityDocuments];

  // Filtering logic
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Download handler
  const handleDownload = (docTitle: string) => {
    alert(`📄 Descargando documento:\n\n"${docTitle}"\n\nEsta es una descarga simulada para demostración.`);
  };

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-green-50">

        {/* Hero Section */}
        <HeroSection
          title="Documentación"
          subtitle="Acceso centralizado a normativa BOE, regulaciones europeas, certificaciones de seguridad y guías de cumplimiento GDPR"
          backgroundImage="/images/content/docus/hero-bg.webp"
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Search & Filters */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar documentos por título o descripción..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="BOE">BOE / Normativa</option>
                    <option value="GDPR">GDPR</option>
                    <option value="Certificaciones">Certificaciones</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de archivo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as DocumentType | 'all')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="xls">XLS</option>
                    <option value="ppt">PPT</option>
                  </select>
                </div>

                {/* Results Counter */}
                <div className="flex items-end">
                  <div className="w-full px-4 py-2 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg border border-primary-200">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-primary-600 font-bold text-lg">{filteredDocuments.length}</span>
                      {' '}documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* BOE Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Normativa BOE y Regulaciones Europeas
              </h2>
              <div className="ml-auto">
                <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                  {boeDocuments.filter(doc =>
                    (selectedCategory === 'all' || doc.category === selectedCategory) &&
                    (selectedType === 'all' || doc.type === selectedType) &&
                    (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length} documentos
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredDocuments
                .filter(doc => doc.category === 'BOE')
                .map((doc, index) => (
                  <DocumentItem
                    key={index}
                    title={doc.title}
                    description={doc.description}
                    type={doc.type}
                    size={doc.size}
                    date={doc.date}
                    onDownload={() => handleDownload(doc.title)}
                    index={index}
                  />
                ))}
            </div>

            {filteredDocuments.filter(doc => doc.category === 'BOE').length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron documentos BOE con los filtros seleccionados
              </div>
            )}
          </motion.section>

          {/* Data Security Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-success-500 to-primary-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Seguridad de Datos y Certificaciones
              </h2>
              <div className="ml-auto">
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {securityDocuments.filter(doc =>
                    (selectedCategory === 'all' || doc.category === selectedCategory) &&
                    (selectedType === 'all' || doc.type === selectedType) &&
                    (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length} documentos
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredDocuments
                .filter(doc => doc.category === 'GDPR' || doc.category === 'Certificaciones')
                .map((doc, index) => (
                  <DocumentItem
                    key={index}
                    title={doc.title}
                    description={doc.description}
                    type={doc.type}
                    size={doc.size}
                    date={doc.date}
                    onDownload={() => handleDownload(doc.title)}
                    index={index}
                  />
                ))}
            </div>

            {filteredDocuments.filter(doc => doc.category === 'GDPR' || doc.category === 'Certificaciones').length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron documentos de seguridad con los filtros seleccionados
              </div>
            )}
          </motion.section>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 p-8 bg-gradient-to-r from-primary-500 to-success-500 rounded-2xl shadow-card-hover text-white"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">¿Necesitas ayuda con la documentación?</h3>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Nuestro equipo legal y de cumplimiento normativo está disponible para ayudarte
                  a entender e implementar los requisitos regulatorios aplicables a tu organización.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                    Contactar Soporte Legal
                  </button>
                  <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                    Agendar Consultoría
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </AppContainer>
  );
}
