'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { getTraceFromDonation } from "@/lib/events"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Skeleton } from "../ui/Skeleton"
import { truncateAddress, formatDate, formatDateTime, formatEther } from "@/lib/helpers"
import { Tooltip } from "../ui/Tooltip"

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
    const { account, web3, contractDonation } = useWallet()
    const [balance, setBalance] = useState<string>("0")
    const [donations, setDonations] = useState<DonationInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalDonations: 0,
        lastDonation: null as Date | null,
        totalDerivatives: 0
    })

    // Obtener donaciones del usuario desde eventos Transfer
    async function fetchDonations() {
        if (!contractDonation || !account) return []

        try {
            const arrDonations: DonationInfo[] = []

            // Obtener todos los eventos Transfer donde 'to' es el account actual
            const transferEvents = await contractDonation.getPastEvents('Transfer', {
                filter: { to: account },
                fromBlock: 0,
                toBlock: 'latest'
            })

            // Para cada evento, obtener la trazabilidad completa
            for (const event of transferEvents) {
                const tokenId = Number(event.returnValues.tokenId)

                try {
                    // Verificar si el token todavía existe (no ha sido quemado)
                    const owner = await contractDonation.methods.ownerOf(tokenId).call()

                    // Si el owner actual es el usuario, entonces todavía lo tiene
                    if (web3!.utils.toChecksumAddress(String(owner)) === web3!.utils.toChecksumAddress(account)) {
                        const { donationTrace } = await getTraceFromDonation(tokenId)

                        if (donationTrace && donationTrace.trace.length > 0) {
                            const donationEvent = donationTrace.trace[0]

                            // Obtener info de derivados si existen
                            const donationData = await contractDonation.methods.donations(tokenId).call()
                            const plasmaId = Number(donationData.plasmaId)
                            const erythrocytesId = Number(donationData.erythrocytesId)
                            const plateletsId = Number(donationData.plateletsId)

                            const derivativesCount =
                                (plasmaId > 0 ? 1 : 0) +
                                (erythrocytesId > 0 ? 1 : 0) +
                                (plateletsId > 0 ? 1 : 0)

                            arrDonations.push({
                                tokenId,
                                donationDate: donationEvent.timestamp,
                                centerName: donationEvent.name,
                                centerAddress: donationEvent.owner,
                                location: donationEvent.location,
                                plasmaId: plasmaId > 0 ? plasmaId : undefined,
                                erythrocytesId: erythrocytesId > 0 ? erythrocytesId : undefined,
                                plateletsId: plateletsId > 0 ? plateletsId : undefined,
                                derivativesCount
                            })
                        }
                    }
                } catch (error) {
                    // El token fue quemado (burn), buscar en eventos pasados
                    const { donationTrace } = await getTraceFromDonation(tokenId)

                    if (donationTrace && donationTrace.trace.length > 0) {
                        const donationEvent = donationTrace.trace[0]

                        // Obtener info de derivados desde trace
                        // Cuando se procesa, hay 3 derivados generados
                        const derivativesCount = 3 // plasma, erythrocytes, platelets

                        arrDonations.push({
                            tokenId,
                            donationDate: donationEvent.timestamp,
                            centerName: donationEvent.name,
                            centerAddress: donationEvent.owner,
                            location: donationEvent.location,
                            plasmaId: undefined,
                            erythrocytesId: undefined,
                            plateletsId: undefined,
                            derivativesCount
                        })
                    }
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
            }
        } catch (error) {
            console.error("Error loading donor data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (account && web3) {
            loadData()
        }
    }, [account, web3, contractDonation])

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
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Dashboard del Donante
                                </h1>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Tooltip content={account || ''}>
                                        <span className="flex items-center gap-2">
                                            <span className="font-semibold">Dirección:</span>
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                {truncateAddress(account || '', 8, 6)}
                                            </code>
                                        </span>
                                    </Tooltip>
                                    <span className="flex items-center gap-2">
                                        <span className="font-semibold">Balance:</span>
                                        <span className="text-success-600 font-bold">{balance} TAS</span>
                                    </span>
                                </div>
                            </div>
                            <Badge status="completed" variant="solid">
                                Donante Activo
                            </Badge>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card variant="elevated" className="h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">
                                        Total Donaciones
                                    </p>
                                    <p className="text-4xl font-bold text-primary-600">
                                        {stats.totalDonations}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">🩸</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card variant="elevated" className="h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">
                                        Última Donación
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">
                                        {stats.lastDonation
                                            ? formatDate(stats.lastDonation)
                                            : 'Sin donaciones'
                                        }
                                    </p>
                                    {stats.lastDonation && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDateTime(stats.lastDonation)}
                                        </p>
                                    )}
                                </div>
                                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">📅</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card variant="elevated" className="h-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">
                                        Derivados Generados
                                    </p>
                                    <p className="text-4xl font-bold text-success-600">
                                        {stats.totalDerivatives}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">🧪</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

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
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Historial de Donaciones por Año
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#6B7280"
                                        style={{ fontSize: '14px' }}
                                    />
                                    <YAxis
                                        stroke="#6B7280"
                                        style={{ fontSize: '14px' }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="donaciones"
                                        stroke="#503291"
                                        strokeWidth={3}
                                        dot={{ fill: '#503291', r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Historial de Donaciones
                </h2>

                {donations.length === 0 ? (
                    <Card variant="elevated">
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">🩸</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No hay donaciones registradas
                            </h3>
                            <p className="text-gray-500">
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
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            Donación #{donation.tokenId}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {formatDateTime(donation.donationDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            Centro de Donación:
                                                        </p>
                                                        <p className="font-semibold text-gray-800">
                                                            {donation.centerName}
                                                        </p>
                                                        <Tooltip content={donation.centerAddress}>
                                                            <code className="text-xs text-gray-500">
                                                                {truncateAddress(donation.centerAddress)}
                                                            </code>
                                                        </Tooltip>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            Ubicación:
                                                        </p>
                                                        <p className="font-semibold text-gray-800 flex items-center gap-1">
                                                            📍 {donation.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Info de derivados */}
                                                {donation.derivativesCount > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-sm text-gray-600 mb-2">
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
                                                                <span className="text-sm text-gray-500 italic">
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
