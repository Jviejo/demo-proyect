'use client';

import React, { useState } from "react";
import { AppContainer } from "../layout";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { motion } from "framer-motion";
import "./../globals.css";

const GetInTouchPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    companyName: "",
    message: "",
    newsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        companyName: "",
        message: "",
        newsletter: false
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      details: "contacto@bloodchain.com",
      link: "mailto:contacto@bloodchain.com"
    },
    {
      icon: "📞",
      title: "Teléfono",
      details: "+34 91 123 4567",
      link: "tel:+34911234567"
    },
    {
      icon: "🏢",
      title: "Oficina",
      details: "Madrid, España",
      link: null
    },
    {
      icon: "⏰",
      title: "Horario",
      details: "Lun-Vie: 9:00 - 18:00",
      link: null
    }
  ];

  return (
    <AppContainer>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

        {/* Hero Section */}
        <Section className="py-16 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Avancemos Juntos
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Iniciar tu transformación en trazabilidad de productos sanguíneos comienza con una conversación. Contáctanos.
              </p>
            </motion.div>
          </Container>
        </Section>

        {/* Contact Info Cards */}
        <Section className="py-12 -mt-8 relative z-10">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-blood-600 hover:text-blood-700 transition-colors"
                    >
                      {info.details}
                    </a>
                  ) : (
                    <p className="text-slate-600">{info.details}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Main Content: Form + Image */}
        <Section className="py-16">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-start">

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    ¿Cómo podemos ayudarte?
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                          Nombre*
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                          placeholder="Juan"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                          Apellido*
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                          placeholder="Pérez"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                        placeholder="juan.perez@hospital.com"
                      />
                    </div>

                    {/* Job Title */}
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-2">
                        Cargo*
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                        placeholder="Director Médico"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                        Organización*
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                        placeholder="Hospital Central"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      />
                    </div>

                    {/* Newsletter Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-blood-600 border-slate-300 rounded focus:ring-blood-500"
                      />
                      <label htmlFor="newsletter" className="text-sm text-slate-600">
                        Quiero recibir actualizaciones y noticias sobre BloodChain
                      </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                        isSubmitting
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blood-600 to-blockchain-600 hover:shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Enviando...
                        </span>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </motion.button>

                    {/* Success Message */}
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-medical-50 border border-medical-200 rounded-lg text-medical-800"
                      >
                        ✓ ¡Mensaje enviado con éxito! Te contactaremos pronto.
                      </motion.div>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Image + Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                {/* Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/people-positive.jpg"
                    alt="Equipo BloodChain"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-br from-blockchain-50 to-blood-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    ¿Por qué elegirnos?
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Respuesta en menos de 24 horas",
                      "Consultoría gratuita inicial",
                      "Equipo multidisciplinar experto",
                      "Soluciones personalizadas",
                      "Soporte continuo 24/7"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blood-600 mt-1">✓</span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Map or Additional CTA */}
        <Section className="py-16 bg-slate-50">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                ¿Prefieres agendar una videollamada?
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Reserva una consulta gratuita de 30 minutos con nuestros expertos
              </p>
              <motion.a
                href="/services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-gradient-to-r from-blockchain-600 to-blood-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Agendar Consulta
              </motion.a>
            </div>
          </Container>
        </Section>
      </div>
    </AppContainer>
  );
};

export default GetInTouchPage;
