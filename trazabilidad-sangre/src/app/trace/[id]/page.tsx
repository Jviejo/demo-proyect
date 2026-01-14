'use client'

import { Spinner } from "@/components/Spinner"
import { getTraceFromDonation } from "@/lib/events"
import { useEffect, useState } from "react"
import { TraceBranch } from "@/components/TraceComponents/TraceBranch"
import { Derivative } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

type FullTrace = Awaited<ReturnType<typeof getTraceFromDonation>>

export default function ({params}: {params: {id: string}}){
    const tokenId = params.id
    const [trace, setTrace] = useState<FullTrace>({donationTrace: undefined})
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [derivativesCollapsed, setDerivativesCollapsed] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getTraceFromDonation(Number(tokenId))
            .then((res) => {
                setTrace(res)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message || 'Error cargando trazabilidad')
                setLoading(false)
            })
    }, [tokenId])

    const handleShare = () => {
        const url = window.location.href
        if (navigator.share) {
            navigator.share({
                title: `Trazabilidad Donación #${tokenId}`,
                text: 'Mira la trazabilidad completa de esta donación',
                url: url
            }).catch(() => {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(url)
                alert('Link copiado al portapapeles')
            })
        } else {
            navigator.clipboard.writeText(url)
            alert('Link copiado al portapapeles')
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Cargando trazabilidad...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/trace')}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                        Volver a Trazabilidad
                    </button>
                </div>
            </div>
        )
    }

    if (trace.donationTrace === undefined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-amber-800 mb-2">Donación no encontrada</h2>
                    <p className="text-amber-600 mb-6">No se encontró la donación con ID #{tokenId}</p>
                    <button
                        onClick={() => router.push('/trace')}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                        Volver a Trazabilidad
                    </button>
                </div>
            </div>
        )
    }

    const hasDerivatives = trace.plasmaTrace && trace.erythrocytesTrace && trace.plateletsTrace
    const totalEvents = trace.donationTrace.trace.length +
        (hasDerivatives ? trace.plasmaTrace.trace.length + trace.erythrocytesTrace.trace.length + trace.plateletsTrace.trace.length : 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
            {/* Header */}
            <motion.div
                className="bg-white shadow-md border-b border-gray-200"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Donación #{tokenId}
                                </h1>
                                <Badge status="completed" variant="solid" />
                            </div>
                            <p className="text-gray-600">
                                Trazabilidad completa desde la donación hasta los derivados
                            </p>
                            <div className="flex gap-4 mt-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{totalEvents}</span> eventos totales
                                </div>
                                {hasDerivatives && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">3</span> derivados generados
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                                title="Compartir"
                            >
                                <span>🔗</span>
                                <span className="hidden sm:inline">Compartir</span>
                            </button>
                            <button
                                onClick={() => router.push('/trace')}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition flex items-center gap-2"
                            >
                                <span>←</span>
                                <span className="hidden sm:inline">Volver</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Donación Original */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                            🩸
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Donación Original</h2>
                            <p className="text-gray-600 text-sm">Historia completa de la donación</p>
                        </div>
                    </div>
                    <TraceBranch trace={trace.donationTrace} product={Derivative.Blood} />
                </motion.div>

                {/* Derivados */}
                {hasDerivatives && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                    🧪
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Derivados Generados</h2>
                                    <p className="text-gray-600 text-sm">Plasma, Eritrocitos y Plaquetas</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDerivativesCollapsed(!derivativesCollapsed)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                            >
                                <span>{derivativesCollapsed ? '▼' : '▲'}</span>
                                <span>{derivativesCollapsed ? 'Expandir' : 'Colapsar'}</span>
                            </button>
                        </div>

                        <AnimatePresence>
                            {!derivativesCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                                                P
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Plasma</h3>
                                        </div>
                                        <TraceBranch trace={trace.plasmaTrace} product={Derivative.Plasma} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                                                E
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Eritrocitos</h3>
                                        </div>
                                        <TraceBranch trace={trace.erythrocytesTrace} product={Derivative.Erythrocytes} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                                                PL
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Plaquetas</h3>
                                        </div>
                                        <TraceBranch trace={trace.plateletsTrace} product={Derivative.Platelets} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}