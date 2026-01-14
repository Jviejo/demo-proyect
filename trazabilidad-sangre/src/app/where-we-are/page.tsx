"use client";

import React, { useState } from "react";
import { AppContainer } from "../layout";
import HeroSection from "@/components/content/HeroSection";
import LocationCard from "@/components/content/LocationCard";
import { motion } from "framer-motion";
import "./../globals.css";

// Locations data
const locations = [
  {
    city: "Madrid",
    country: "España",
    address: "Calle de Serrano 47, 28001 Madrid, España",
    phone: "+34 91 123 4567",
    email: "madrid@bloodchain.eu",
    hours: "Lunes-Viernes: 8:00-18:00",
    image: "/images/content/locations/madrid.webp",
    mapLink: "https://maps.google.com/?q=Madrid,Spain",
    coordinates: { lat: 40.4168, lng: -3.7038 },
  },
  {
    city: "Barcelona",
    country: "España",
    address: "Passeig de Gràcia 85, 08008 Barcelona, España",
    phone: "+34 93 987 6543",
    email: "barcelona@bloodchain.eu",
    hours: "Lunes-Viernes: 8:00-18:00",
    image: "/images/content/locations/barcelona.webp",
    mapLink: "https://maps.google.com/?q=Barcelona,Spain",
    coordinates: { lat: 41.3851, lng: 2.1734 },
  },
  {
    city: "París",
    country: "Francia",
    address: "15 Avenue des Champs-Élysées, 75008 Paris, France",
    phone: "+33 1 42 56 78 90",
    email: "paris@bloodchain.eu",
    hours: "Lundi-Vendredi: 9:00-19:00",
    image: "/images/content/locations/paris.webp",
    mapLink: "https://maps.google.com/?q=Paris,France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    city: "Berlín",
    country: "Alemania",
    address: "Unter den Linden 77, 10117 Berlin, Deutschland",
    phone: "+49 30 1234 5678",
    email: "berlin@bloodchain.eu",
    hours: "Montag-Freitag: 8:00-17:00",
    image: "/images/content/locations/berlin.webp",
    mapLink: "https://maps.google.com/?q=Berlin,Germany",
    coordinates: { lat: 52.52, lng: 13.405 },
  },
  {
    city: "Roma",
    country: "Italia",
    address: "Via del Corso 126, 00186 Roma, Italia",
    phone: "+39 06 1234 5678",
    email: "roma@bloodchain.eu",
    hours: "Lunedì-Venerdì: 9:00-18:00",
    image: "/images/content/locations/rome.webp",
    mapLink: "https://maps.google.com/?q=Rome,Italy",
    coordinates: { lat: 41.9028, lng: 12.4964 },
  },
];

export default function WhereWeAre() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  return (
    <AppContainer>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection
          title="Nuestras Oficinas en Europa"
          subtitle="Presencia Internacional para un Servicio de Trazabilidad Global"
          backgroundImage="/images/content/locations/madrid.webp"
        />

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-card p-6 text-center"
            >
              <p className="text-4xl font-bold text-primary-600">{locations.length}</p>
              <p className="text-gray-600 mt-2">Oficinas</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-card p-6 text-center"
            >
              <p className="text-4xl font-bold text-success-600">24/7</p>
              <p className="text-gray-600 mt-2">Soporte</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-card p-6 text-center"
            >
              <p className="text-4xl font-bold text-primary-600">150+</p>
              <p className="text-gray-600 mt-2">Empleados</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-card p-6 text-center"
            >
              <p className="text-4xl font-bold text-success-600">27</p>
              <p className="text-gray-600 mt-2">Países Servidos</p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-card p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              🗺️ Mapa de Ubicaciones
            </h2>

            {/* Simplified Map Representation */}
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="relative w-full max-w-4xl aspect-video">
                {/* Map markers */}
                {locations.map((location, index) => (
                  <motion.button
                    key={location.city}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedLocation(index)}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-all ${
                      selectedLocation === index
                        ? "bg-success-600 ring-4 ring-success-300"
                        : "bg-primary-600 hover:bg-primary-700"
                    }`}
                    style={{
                      // Simplified positioning based on rough European coordinates
                      left: `${
                        ((location.coordinates.lng + 10) / 40) * 100
                      }%`,
                      top: `${
                        ((55 - location.coordinates.lat) / 15) * 100
                      }%`,
                    }}
                    title={location.city}
                  >
                    📍
                  </motion.button>
                ))}

                {/* Selected location popup */}
                {selectedLocation !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 z-10 min-w-[250px]"
                  >
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                    <h3 className="text-xl font-bold text-primary-600 mb-2">
                      {locations[selectedLocation].city}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {locations[selectedLocation].country}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {locations[selectedLocation].address}
                    </p>
                    <a
                      href={locations[selectedLocation].mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-3 py-2 bg-primary-600 text-white text-center text-sm rounded hover:bg-primary-700 transition-colors"
                    >
                      Ver en Google Maps
                    </a>
                  </motion.div>
                )}
              </div>
            </div>

            <p className="text-center text-gray-500 mt-4 text-sm">
              Haz clic en los marcadores 📍 para ver detalles de cada oficina
            </p>
          </motion.div>
        </section>

        {/* Locations Grid */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              📍 Nuestras Oficinas
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Contamos con oficinas estratégicamente ubicadas en las principales
              ciudades europeas para ofrecer el mejor servicio de trazabilidad de
              productos sanguíneos.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location, index) => (
                <LocationCard
                  key={location.city}
                  city={location.city}
                  country={location.country}
                  address={location.address}
                  phone={location.phone}
                  email={location.email}
                  hours={location.hours}
                  image={location.image}
                  mapLink={location.mapLink}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact CTA Section */}
        <section className="container mx-auto px-4 py-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-success-600 rounded-lg shadow-card p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas más información?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Nuestro equipo está disponible para ayudarte con cualquier consulta
              sobre nuestros servicios de trazabilidad blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@bloodchain.eu"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                📧 Enviar Email
              </a>
              <a
                href="tel:+34911234567"
                className="px-8 py-3 bg-white/10 backdrop-blur text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-colors inline-block"
              >
                📞 Llamar Ahora
              </a>
            </div>
          </motion.div>
        </section>

        {/* Coverage Map Section */}
        <section className="container mx-auto px-4 py-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🌍 Cobertura de Servicios
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇪🇸</p>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Península Ibérica
                </h4>
                <p className="text-sm text-gray-600">
                  España, Portugal, Andorra
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇫🇷</p>
                <h4 className="font-semibold text-gray-800 mb-2">Europa Occidental</h4>
                <p className="text-sm text-gray-600">
                  Francia, Bélgica, Luxemburgo
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇩🇪</p>
                <h4 className="font-semibold text-gray-800 mb-2">Europa Central</h4>
                <p className="text-sm text-gray-600">
                  Alemania, Austria, Suiza
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇮🇹</p>
                <h4 className="font-semibold text-gray-800 mb-2">Mediterráneo</h4>
                <p className="text-sm text-gray-600">Italia, Grecia, Malta</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇵🇱</p>
                <h4 className="font-semibold text-gray-800 mb-2">Europa del Este</h4>
                <p className="text-sm text-gray-600">
                  Polonia, República Checa, Hungría
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl mb-3">🇬🇧</p>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Islas Británicas
                </h4>
                <p className="text-sm text-gray-600">Reino Unido, Irlanda</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </AppContainer>
  );
}
