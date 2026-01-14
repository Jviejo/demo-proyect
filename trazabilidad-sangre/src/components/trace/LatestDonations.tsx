'use client'

import { motion } from 'framer-motion'
import { formatRelativeTime, truncateAddress } from '@/lib/helpers'
import Link from 'next/link'

interface Donation {
    id: number
    donor: string
    center: string
    timestamp: number
    blockNumber: number
}

interface LatestDonationsProps {
    donations: Donation[]
    maxItems?: number
}

export function LatestDonations({ donations, maxItems = 10 }: LatestDonationsProps) {
    const displayDonations = donations.slice(0, maxItems)

    if (displayDonations.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">No hay donaciones registradas aún</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl shadow">
                        🩸
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Últimas Donaciones</h3>
                        <p className="text-sm text-gray-600">Actividad reciente en el sistema</p>
                    </div>
                </div>
                <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {displayDonations.length} registros
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-success-200 to-primary-200" />

                {/* Items */}
                <div className="space-y-6">
                    {displayDonations.map((donation, index) => (
                        <motion.div
                            key={donation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-12"
                        >
                            {/* Timeline node */}
                            <div className="absolute left-5 top-2 -translate-x-1/2">
                                <div className="w-3 h-3 bg-primary-500 rounded-full border-2 border-white shadow-md" />
                            </div>

                            {/* Card */}
                            <Link href={`/trace/${donation.id}`}>
                                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer border border-gray-200 group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg font-bold text-primary-600 group-hover:text-primary-700">
                                                    Donación #{donation.id}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatRelativeTime(new Date(donation.timestamp * 1000))}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">👤 Donante:</span>
                                                    <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                                                        {truncateAddress(donation.donor)}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">🏥 Centro:</span>
                                                    <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                                                        {truncateAddress(donation.center)}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">📦 Bloque:</span>
                                                    <span className="text-xs">#{donation.blockNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl group-hover:scale-110 transition-transform">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* View all link */}
            {donations.length > maxItems && (
                <div className="mt-6 text-center">
                    <Link
                        href="/trace"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                    >
                        <span>Ver todas las donaciones</span>
                        <span>→</span>
                    </Link>
                </div>
            )}
        </div>
    )
}
