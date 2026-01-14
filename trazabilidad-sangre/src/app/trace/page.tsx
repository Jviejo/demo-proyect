'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/components/ConnectWalletButton'
import { SearchHero } from '@/components/trace/SearchHero'
import { LatestDonations } from '@/components/trace/LatestDonations'
import { TopDonors } from '@/components/trace/TopDonors'
import { getTraceFromDonation } from '@/lib/events'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

interface DonationData {
    id: number
    donor: string
    center: string
    timestamp: number
    blockNumber: number
}

interface DonorData {
    address: string
    name?: string
    donationCount: number
    lastDonation?: number
}

interface Stats {
    totalDonations: number
    totalDerivatives: number
    totalCenters: number
    todayTransactions: number
}

export default function TracePage() {
    const { web3, contractDonation, contractTracker } = useWallet()
    const [isLoading, setIsLoading] = useState(true)
    const [donations, setDonations] = useState<DonationData[]>([])
    const [donors, setDonors] = useState<DonorData[]>([])
    const [stats, setStats] = useState<Stats>({
        totalDonations: 0,
        totalDerivatives: 0,
        totalCenters: 0,
        todayTransactions: 0
    })
    const [selectedRegion, setSelectedRegion] = useState<string>('all')

    // Regiones disponibles
    const regions = [
        { value: 'all', label: 'Todas las regiones' },
        { value: 'madrid', label: 'Madrid' },
        { value: 'barcelona', label: 'Barcelona' },
        { value: 'valencia', label: 'Valencia' },
        { value: 'sevilla', label: 'Sevilla' }
    ]

    // Fetch all data
    useEffect(() => {
        fetchAllData()
    }, [contractDonation, contractTracker, web3])

    async function fetchAllData() {
        if (!contractDonation || !contractTracker || !web3) {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)

            // Fetch donations
            const donationsData = await fetchDonations()
            setDonations(donationsData)

            // Fetch donors
            const donorsData = await fetchDonors(donationsData)
            setDonors(donorsData)

            // Calculate stats
            const statsData = await calculateStats(donationsData)
            setStats(statsData)

        } catch (error) {
            console.error('Error fetching trace data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchDonations(): Promise<DonationData[]> {
        if (!contractDonation || !web3) return []

        try {
            const transferEvents = await contractDonation.getPastEvents('Transfer', {
                filter: { from: '0x0000000000000000000000000000000000000000' },
                fromBlock: 0,
                toBlock: 'latest'
            })

            const donationsArr: DonationData[] = []

            for (const event of transferEvents) {
                const tokenId = Number(event.returnValues.tokenId)
                const donorAddress = String(event.returnValues.to)
                const blockNumber = Number(event.blockNumber)

                try {
                    const { donationTrace } = await getTraceFromDonation(tokenId)

                    if (donationTrace && donationTrace.trace.length > 0) {
                        const donationEvent = donationTrace.trace[0]

                        donationsArr.push({
                            id: tokenId,
                            donor: donorAddress,
                            center: donationEvent.owner,
                            timestamp: Math.floor(donationEvent.timestamp.getTime() / 1000),
                            blockNumber
                        })
                    }
                } catch (error) {
                    console.error(`Error processing donation ${tokenId}:`, error)
                }
            }

            // Sort by timestamp descending
            donationsArr.sort((a, b) => b.timestamp - a.timestamp)

            return donationsArr
        } catch (error) {
            console.error('Error fetching donations:', error)
            return []
        }
    }

    async function fetchDonors(donationsData: DonationData[]): Promise<DonorData[]> {
        // Count donations per donor
        const donorMap = new Map<string, { count: number, lastDonation: number }>()

        donationsData.forEach(donation => {
            const existing = donorMap.get(donation.donor)
            if (existing) {
                existing.count++
                existing.lastDonation = Math.max(existing.lastDonation, donation.timestamp)
            } else {
                donorMap.set(donation.donor, {
                    count: 1,
                    lastDonation: donation.timestamp
                })
            }
        })

        // Convert to array
        const donorsArr: DonorData[] = Array.from(donorMap.entries()).map(([address, data]) => ({
            address,
            donationCount: data.count,
            lastDonation: data.lastDonation
        }))

        // Sort by donation count descending
        donorsArr.sort((a, b) => b.donationCount - a.donationCount)

        return donorsArr
    }

    async function calculateStats(donationsData: DonationData[]): Promise<Stats> {
        let totalDerivatives = 0
        let centersSet = new Set<string>()
        let todayTransactions = 0

        const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)

        donationsData.forEach(donation => {
            // Each donation generates 3 derivatives (plasma, erythrocytes, platelets)
            totalDerivatives += 3

            // Count unique centers
            centersSet.add(donation.center)

            // Count today's transactions
            if (donation.timestamp >= todayStart) {
                todayTransactions++
            }
        })

        return {
            totalDonations: donationsData.length,
            totalDerivatives,
            totalCenters: centersSet.size,
            todayTransactions
        }
    }

    // Filter donations by region (simplified - in production would use actual location data)
    const filteredDonations = selectedRegion === 'all'
        ? donations
        : donations // In production, filter by actual location data

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Search Section */}
                <SearchHero />

                {/* Stats Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Estadísticas del Sistema</h2>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} variant="card" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Donations */}
                            <Card variant="elevated" hoverable>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Donaciones</p>
                                        <p className="text-3xl font-bold text-primary-600">{stats.totalDonations}</p>
                                        <p className="text-xs text-gray-500 mt-2">🩸 Unidades de sangre</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                                        🩸
                                    </div>
                                </div>
                            </Card>

                            {/* Total Derivatives */}
                            <Card variant="elevated" hoverable>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Derivados Generados</p>
                                        <p className="text-3xl font-bold text-success-600">{stats.totalDerivatives}</p>
                                        <p className="text-xs text-gray-500 mt-2">💉 Plasma, eritrocitos, plaquetas</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                                        💉
                                    </div>
                                </div>
                            </Card>

                            {/* Total Centers */}
                            <Card variant="elevated" hoverable>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Centros Registrados</p>
                                        <p className="text-3xl font-bold text-primary-600">{stats.totalCenters}</p>
                                        <p className="text-xs text-gray-500 mt-2">🏥 Centros de donación activos</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                                        🏥
                                    </div>
                                </div>
                            </Card>

                            {/* Today Transactions */}
                            <Card variant="elevated" hoverable>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Transacciones Hoy</p>
                                        <p className="text-3xl font-bold text-success-600">{stats.todayTransactions}</p>
                                        <p className="text-xs text-gray-500 mt-2">📈 Actividad del día</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                                        📈
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </motion.div>

                {/* Region Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📍</span>
                                <label className="text-sm font-semibold text-gray-700">Buscar por región:</label>
                            </div>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                            >
                                {regions.map(region => (
                                    <option key={region.value} value={region.value}>
                                        {region.label}
                                    </option>
                                ))}
                            </select>
                            <div className="text-sm text-gray-600">
                                {filteredDonations.length} resultado{filteredDonations.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Latest Donations and Top Donors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Latest Donations */}
                    <div>
                        {isLoading ? (
                            <Skeleton variant="card" />
                        ) : (
                            <LatestDonations donations={filteredDonations} maxItems={10} />
                        )}
                    </div>

                    {/* Top Donors */}
                    <div>
                        {isLoading ? (
                            <Skeleton variant="card" />
                        ) : (
                            <TopDonors donors={donors} maxItems={10} />
                        )}
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card variant="outlined">
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">🔐</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sistema de Trazabilidad Blockchain</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Todas las donaciones y derivados están registrados en blockchain, garantizando
                                transparencia total y trazabilidad inmutable del ciclo de vida de cada donación.
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                                    <span>Red: TSC Testnet</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                    <span>Smart Contracts Verificados</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
