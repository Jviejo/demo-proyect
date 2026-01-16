'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTraceFromDonation } from "@/lib/events"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress, formatDate, formatDateTime, formatEther } from "@/lib/helpers"
import { Tooltip } from "../ui/Tooltip"
import { HeartIcon, CalendarDaysIcon, BeakerIcon } from '@heroicons/react/24/solid'

const navigationCards = [
    {
        name: "Trazabilidad",
        description: "Rastrear mis donaciones",
        icon: "🔍",
        path: "/trace",
        gradient: "from-blood-500 to-blood-700"
    }
]

interface DonationInfo {
    tokenId: number
    donationDate: Date
    centerName: string
    centerAddress: string
    location: string
    plasmaId?: number
    erythrocytesId?: number
    plateletsId?: number
    derivativesCount: number
}

function Donor() {
    const { account, web3, contractDonation, contractTracker } = useWallet()
    const router = useRouter()
    const [balance, setBalance] = useState<string>("0")
    const [donations, setDonations] = useState<DonationInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistered, setIsRegistered] = useState(false)
    const [stats, setStats] = useState({
        totalDonations: 0,
        lastDonation: null as Date | null,
        totalDerivatives: 0
    })

    // Obtener donaciones del usuario desde eventos Donation del BloodTracker
    async function fetchDonations() {
        if (!contractDonation || !contractTracker || !account || !web3) return []

        try {
            const arrDonations: DonationInfo[] = []

            // Obtener todos los eventos Donation del BloodTracker donde 'donor' es el donante
            const donationEvents = await contractTracker.getPastEvents('Donation', {
                filter: { donor: account },
                fromBlock: 0,
                toBlock: 'latest'
            })

            console.log(`Found ${donationEvents.length} donation events for ${account}`)

            // Para cada evento Donation, obtener los detalles completos
            for (const event of donationEvents) {
                const tokenId = Number(event.returnValues.tokenId)
                const centerAddress = String(event.returnValues.center)

                try {
                    // Obtener timestamp del bloque
                    const block = await web3.eth.getBlock(event.blockHash)
                    const timestamp = new Date(Number(block.timestamp) * 1000)

                    // Obtener información del centro
                    const centerInfo = await contractTracker.methods.companies(centerAddress).call()

                    // Obtener info de derivados si existen
                    let plasmaId = 0
                    let erythrocytesId = 0
                    let plateletsId = 0

                    try {
                        const donationData = await contractDonation.methods.donations(tokenId).call()
                        plasmaId = Number(donationData.plasmaId)
                        erythrocytesId = Number(donationData.erythrocytesId)
                        plateletsId = Number(donationData.plateletsId)
                    } catch (err) {
                        // El token fue quemado o no se puede acceder
                        console.log(`Token ${tokenId} was burned or cannot be accessed`)
                    }

                    const derivativesCount =
                        (plasmaId > 0 ? 1 : 0) +
                        (erythrocytesId > 0 ? 1 : 0) +
                        (plateletsId > 0 ? 1 : 0)

                    arrDonations.push({
                        tokenId,
                        donationDate: timestamp,
                        centerName: String(centerInfo.name),
                        centerAddress: centerAddress,
                        location: String(centerInfo.location),
                        plasmaId: plasmaId > 0 ? plasmaId : undefined,
                        erythrocytesId: erythrocytesId > 0 ? erythrocytesId : undefined,
                        plateletsId: plateletsId > 0 ? plateletsId : undefined,
                        derivativesCount
                    })

                    console.log(`Added donation ${tokenId}`)
                } catch (error) {
                    // Ignorar errores de tokens individuales
                    console.error(`Error processing donation ${tokenId}:`, error)
                }
            }

            // Ordenar por fecha descendente (más reciente primero)
            arrDonations.sort((a, b) => b.donationDate.getTime() - a.donationDate.getTime())

            return arrDonations
        } catch (error) {
            console.error("Error fetching donations:", error)
            return []
        }
    }

    // Calcular estadísticas
    function calculateStats(donations: DonationInfo[]) {
        const totalDonations = donations.length
        const lastDonation = donations.length > 0 ? donations[0].donationDate : null
        const totalDerivatives = donations.reduce((sum, d) => sum + d.derivativesCount, 0)

        setStats({
            totalDonations,
            lastDonation,
            totalDerivatives
        })
    }

    // Preparar datos para el gráfico de donaciones por año
    function prepareChartData(donations: DonationInfo[]) {
        const donationsByYear: { [key: string]: number } = {}

        donations.forEach(d => {
            const year = d.donationDate.getFullYear().toString()
            donationsByYear[year] = (donationsByYear[year] || 0) + 1
        })

        return Object.entries(donationsByYear)
            .map(([year, count]) => ({ year, donaciones: count }))
            .sort((a, b) => parseInt(a.year) - parseInt(b.year))
    }

    // Verificar si el usuario está registrado como donante
    // Un donante está registrado si tiene al menos una donación
    async function checkDonorRegistration(donations: DonationInfo[]) {
        return donations.length > 0
    }

    // Cargar datos
    async function loadData() {
        setIsLoading(true)
        try {
            if (account && web3) {
                const weiBalance = await web3.eth.getBalance(account)
                setBalance(formatEther(weiBalance))

                const donationsData = await fetchDonations()
                setDonations(donationsData)
                calculateStats(donationsData)

                // Verificar si está registrado basándose en si tiene donaciones
                const registered = await checkDonorRegistration(donationsData)
                setIsRegistered(registered)
            }
        } catch (error) {
            console.error("Error loading donor data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (account && web3 && contractDonation && contractTracker) {
            loadData()
        }
    }, [account, web3, contractDonation, contractTracker])

    const chartData = prepareChartData(donations)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton variant="card" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Skeleton variant="card" />
                    <Skeleton variant="card" />
                    <Skeleton variant="card" />
                </div>
            </div>
        )
    }

    // Si no está registrado como donante, mostrar mensaje
    if (!isRegistered) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card variant="elevated" className="max-w-2xl mx-auto">
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-6">🩸</div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            No estás registrado como donante
                        </h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Para acceder al dashboard de donante, primero necesitas realizar una donación de sangre
                            en un centro de donación registrado.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-900">
                                <strong>ℹ️ ¿Cómo registrarme?</strong><br />
                                Visita un centro de donación registrado en la plataforma. Ellos se encargarán
                                de registrar tu donación en el sistema blockchain.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/all-role-grid')}
                            className="px-6 py-3 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white rounded-lg font-semibold hover:from-blood-700 hover:to-blockchain-700 transition-all"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card variant="elevated" className="mb-6">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard del Donante
                        </h1>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
            >
                <Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
                    <Stat
                        icon={<HeartIcon className="h-6 w-6" />}
                        label="Total Donaciones"
                        value={stats.totalDonations}
                        color="blood"
                    />
                    <Stat
                        icon={<CalendarDaysIcon className="h-6 w-6" />}
                        label="Última Donación"
                        value={stats.lastDonation ? formatDate(stats.lastDonation) : 'Sin donaciones'}
                        color="blockchain"
                    />
                    <Stat
                        icon={<BeakerIcon className="h-6 w-6" />}
                        label="Derivados Generados"
                        value={stats.totalDerivatives}
                        color="medical"
                    />
                </Grid>
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Acciones Rápidas
                </h2>
                <Grid cols={{ xs: 1, md: 2 }} gap="md">
                    {navigationCards.map((card, index) => (
                        <motion.div
                            key={card.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                variant="elevated"
                                className="h-full cursor-pointer hover:shadow-2xl transition-all"
                                onClick={() => router.push(card.path)}
                            >
                                <div className={`p-6 bg-gradient-to-br ${card.gradient} text-white`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-5xl">{card.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                                    <p className="text-white/90 text-sm">{card.description}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </Grid>
            </motion.div>

            {/* Gráfico de Donaciones por Año */}
            {chartData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <Card variant="elevated">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Historial de Donaciones por Año
                            </h2>
                            {chartData.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-slate-400">
                                    <div className="text-center">
                                        <p className="text-lg">No hay datos para mostrar</p>
                                        <p className="text-sm mt-2">Las donaciones aparecerán aquí cuando las realices</p>
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="year"
                                            stroke="#6B7280"
                                            style={{ fontSize: '14px', fontWeight: '500' }}
                                            label={{ value: 'Año', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#6B7280' } }}
                                        />
                                        <YAxis
                                            stroke="#6B7280"
                                            style={{ fontSize: '14px' }}
                                            allowDecimals={false}
                                            label={{ value: 'Donaciones', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B7280' } }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                padding: '12px'
                                            }}
                                            formatter={(value: any) => [`${value} donación(es)`, 'Donaciones']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="donaciones"
                                            stroke="#DC2626"
                                            strokeWidth={3}
                                            dot={{ fill: '#DC2626', r: 6, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Historial de Donaciones */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Historial de Donaciones
                </h2>

                {donations.length === 0 ? (
                    <Card variant="elevated">
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">🩸</div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                No hay donaciones registradas
                            </h3>
                            <p className="text-slate-500">
                                Todavía no has realizado ninguna donación en el sistema.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {donations.map((donation, index) => (
                            <motion.div
                                key={donation.tokenId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card variant="elevated" className="hover:shadow-2xl transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between flex-wrap gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-2xl">🩸</span>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            Donación #{donation.tokenId}
                                                        </h3>
                                                        <p className="text-sm text-slate-600">
                                                            {formatDateTime(donation.donationDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-sm text-slate-600 mb-1">
                                                            Centro de Donación:
                                                        </p>
                                                        <p className="font-semibold text-slate-900">
                                                            {donation.centerName}
                                                        </p>
                                                        <Tooltip content={donation.centerAddress}>
                                                            <code className="text-xs text-slate-500">
                                                                {truncateAddress(donation.centerAddress)}
                                                            </code>
                                                        </Tooltip>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-slate-600 mb-1">
                                                            Ubicación:
                                                        </p>
                                                        <p className="font-semibold text-slate-900 flex items-center gap-1">
                                                            📍 {donation.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Info de derivados */}
                                                {donation.derivativesCount > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-sm text-slate-600 mb-2">
                                                            Derivados generados:
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {donation.plasmaId && (
                                                                <Badge status="completed" variant="soft">
                                                                    Plasma #{donation.plasmaId}
                                                                </Badge>
                                                            )}
                                                            {donation.erythrocytesId && (
                                                                <Badge status="processing" variant="soft">
                                                                    Eritrocitos #{donation.erythrocytesId}
                                                                </Badge>
                                                            )}
                                                            {donation.plateletsId && (
                                                                <Badge status="pending" variant="soft">
                                                                    Plaquetas #{donation.plateletsId}
                                                                </Badge>
                                                            )}
                                                            {!donation.plasmaId && !donation.erythrocytesId && !donation.plateletsId && (
                                                                <span className="text-sm text-slate-500 italic">
                                                                    Procesada (3 derivados generados)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <Badge
                                                    status={donation.derivativesCount > 0 ? "completed" : "processing"}
                                                    variant="solid"
                                                >
                                                    {donation.derivativesCount > 0 ? "Procesada" : "Pendiente"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default Donor
