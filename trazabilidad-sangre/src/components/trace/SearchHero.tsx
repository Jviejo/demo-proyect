'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface SearchHeroProps {
    backgroundImage?: string
    title?: string
    subtitle?: string
}

export function SearchHero({
    backgroundImage = '/images/content/trace/hero-bg.webp',
    title = 'Trazabilidad de Donaciones',
    subtitle = 'Rastrea el ciclo completo de vida de cada donación y sus derivados'
}: SearchHeroProps) {
    const [searchId, setSearchId] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchId.trim()) {
            router.push(`/trace/${searchId.trim()}`)
        }
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blood-600 to-blockchain-700 rounded-2xl shadow-2xl">
            {/* Background image overlay */}
            <div
                className="absolute inset-0 opacity-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blood-500/50 via-transparent to-blockchain-500/30" />

            {/* Content */}
            <div className="relative z-10 px-6 py-16 md:px-12 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl shadow-lg">
                            🔍
                        </div>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                        {subtitle}
                    </p>

                    {/* Search form */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Ingresa el ID de donación (ej: 1, 2, 3...)"
                                className="flex-1 px-6 py-4 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-medical-400 transition shadow-lg"
                            />
                            <button
                                type="submit"
                                disabled={!searchId.trim()}
                                className="px-8 py-4 bg-medical-500 text-white font-semibold rounded-xl hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>🔍</span>
                                <span>Buscar</span>
                            </button>
                        </div>
                    </motion.form>

                    {/* Quick info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-white/80 text-sm"
                    >
                        <p>💡 Tip: Cada donación tiene un ID único que puedes usar para rastrear su historial completo</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blockchain-400 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blood-400 rounded-full blur-3xl opacity-20 -ml-48 -mb-48" />
        </div>
    )
}
