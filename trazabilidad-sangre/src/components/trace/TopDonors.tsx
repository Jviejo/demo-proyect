'use client'

import { motion } from 'framer-motion'
import { truncateAddress } from '@/lib/helpers'

interface Donor {
    address: string
    name?: string
    donationCount: number
    lastDonation?: number
}

interface TopDonorsProps {
    donors: Donor[]
    maxItems?: number
}

export function TopDonors({ donors, maxItems = 10 }: TopDonorsProps) {
    const displayDonors = donors.slice(0, maxItems).sort((a, b) => b.donationCount - a.donationCount)

    if (displayDonors.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600">No hay donantes registrados aún</p>
            </div>
        )
    }

    const getMedalEmoji = (index: number) => {
        switch (index) {
            case 0: return '🥇'
            case 1: return '🥈'
            case 2: return '🥉'
            default: return '🏅'
        }
    }

    const getRankColor = (index: number) => {
        switch (index) {
            case 0: return 'from-yellow-400 to-yellow-600'
            case 1: return 'from-gray-300 to-gray-500'
            case 2: return 'from-amber-600 to-amber-800'
            default: return 'from-primary-400 to-primary-600'
        }
    }

    const getInitials = (address: string) => {
        return address.slice(2, 4).toUpperCase()
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center text-white text-xl shadow">
                        👑
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Top Donantes</h3>
                        <p className="text-sm text-gray-600">Los héroes que más donan</p>
                    </div>
                </div>
                <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {displayDonors.length} donantes
                </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
                {displayDonors.map((donor, index) => (
                    <motion.div
                        key={donor.address}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <div className={`
                            bg-gradient-to-r ${index < 3 ? 'from-gray-50 to-white border-2' : 'from-white to-gray-50 border'}
                            ${index === 0 ? 'border-yellow-300' : index === 1 ? 'border-gray-300' : index === 2 ? 'border-amber-300' : 'border-gray-200'}
                            rounded-lg p-4 hover:shadow-md transition-all
                        `}>
                            <div className="flex items-center gap-4">
                                {/* Rank badge */}
                                <div className={`
                                    w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(index)}
                                    flex items-center justify-center text-white font-bold shadow-lg
                                    flex-shrink-0
                                `}>
                                    <span className="text-xl">{getMedalEmoji(index)}</span>
                                </div>

                                {/* Avatar */}
                                <div className={`
                                    w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-success-400
                                    flex items-center justify-center text-white font-bold shadow-md
                                    flex-shrink-0
                                `}>
                                    {getInitials(donor.address)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {donor.name ? (
                                            <span className="font-semibold text-gray-900 truncate">
                                                {donor.name}
                                            </span>
                                        ) : (
                                            <code className="text-sm font-mono text-gray-700 truncate">
                                                {truncateAddress(donor.address, 6, 4)}
                                            </code>
                                        )}
                                    </div>
                                    <code className="text-xs text-gray-500 font-mono">
                                        {truncateAddress(donor.address)}
                                    </code>
                                </div>

                                {/* Donation count */}
                                <div className="text-right flex-shrink-0">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {donor.donationCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {donor.donationCount === 1 ? 'donación' : 'donaciones'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Total summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total de donaciones</span>
                    <span className="text-2xl font-bold text-primary-600">
                        {displayDonors.reduce((acc, donor) => acc + donor.donationCount, 0)}
                    </span>
                </div>
            </div>
        </div>
    )
}
