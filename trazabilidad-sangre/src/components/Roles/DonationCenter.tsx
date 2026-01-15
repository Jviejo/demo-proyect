'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTraceFromDonation } from "@/lib/events"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { ConfirmModal } from "../ui/ConfirmModal"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress, formatDate, formatDateTime, formatEther } from "@/lib/helpers"
import { Tooltip } from "../ui/Tooltip"
import { showTransactionSuccess, showTransactionError, showTransactionPending, showGenericError, showGenericSuccess } from "@/lib/toast"
import { CalendarIcon, ChartBarIcon, BeakerIcon, MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'

interface DonationInfo {
    tokenId: number
    donationDate: Date
    donorAddress: string
    bloodType: string
    location: string
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const BLOOD_TYPE_COLORS: { [key: string]: string } = {
    'A+': '#FF6B6B',
    'A-': '#FF8E8E',
    'B+': '#4ECDC4',
    'B-': '#6FE4DB',
    'AB+': '#FFE66D',
    'AB-': '#FFF097',
    'O+': '#A8E6CF',
    'O-': '#C4F1DF'
}

const navigationCards = [
    {
        name: "Trazabilidad",
        description: "Rastrear donaciones registradas",
        icon: "🔍",
        path: "/trace",
        gradient: "from-blockchain-500 to-blockchain-700"
    },
    {
        name: "Marketplace",
        description: "Ver derivados disponibles",
        icon: "🛒",
        path: "/marketplace",
        gradient: "from-medical-500 to-medical-700"
    }
]

function DonationCenter() {
    const { account, web3, contractTracker, contractDonation } = useWallet()
    const router = useRouter()
    const [balance, setBalance] = useState<string>("0")
    const [donations, setDonations] = useState<DonationInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [stats, setStats] = useState({
        today: 0,
        thisMonth: 0,
        total: 0
    })

    // Formulario
    const [formData, setFormData] = useState({
        donorAddress: '',
        bloodType: 'A+'
    })
    const [formErrors, setFormErrors] = useState({
        donorAddress: ''
    })

    // Obtener donaciones realizadas por este centro
    async function fetchDonations() {
        if (!contractDonation || !account) return []

        try {
            const arrDonations: DonationInfo[] = []

            // Obtener todos los eventos Transfer del contrato BloodDonation
            // donde 'from' es address(0) (mint) y podemos identificar que fue este centro
            const transferEvents = await contractDonation.getPastEvents('Transfer', {
                filter: { from: '0x0000000000000000000000000000000000000000' },
                fromBlock: 0,
                toBlock: 'latest'
            })

            // Para cada evento, verificar si el centro actual lo creó
            for (const event of transferEvents) {
                const tokenId = Number(event.returnValues.tokenId)
                const donorAddress = String(event.returnValues.to)

                try {
                    const { donationTrace } = await getTraceFromDonation(tokenId)

                    if (donationTrace && donationTrace.trace.length > 0) {
                        const donationEvent = donationTrace.trace[0]

                        // Verificar si este centro fue quien registró la donación
                        if (web3!.utils.toChecksumAddress(donationEvent.owner) === web3!.utils.toChecksumAddress(account)) {
                            // Simular tipo de sangre basado en tokenId (en producción vendría de metadata)
                            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                            const bloodType = bloodTypes[tokenId % bloodTypes.length]

                            arrDonations.push({
                                tokenId,
                                donationDate: donationEvent.timestamp,
                                donorAddress: donorAddress,
                                bloodType,
                                location: donationEvent.location
                            })
                        }
                    }
                } catch (error) {
                    // Ignorar errores de tokens individuales
                    console.error(`Error processing token ${tokenId}:`, error)
                }
            }

            // Ordenar por fecha descendente
            arrDonations.sort((a, b) => b.donationDate.getTime() - a.donationDate.getTime())

            return arrDonations
        } catch (error) {
            console.error("Error fetching donations:", error)
            return []
        }
    }

    // Calcular estadísticas
    function calculateStats(donations: DonationInfo[]) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        const todayCount = donations.filter(d => d.donationDate >= today).length
        const thisMonthCount = donations.filter(d => d.donationDate >= thisMonthStart).length
        const totalCount = donations.length

        setStats({
            today: todayCount,
            thisMonth: thisMonthCount,
            total: totalCount
        })
    }

    // Preparar datos para gráfico por tipo de sangre
    function prepareBloodTypeData(donations: DonationInfo[]) {
        const bloodTypeCount: { [key: string]: number } = {}

        donations.forEach(d => {
            bloodTypeCount[d.bloodType] = (bloodTypeCount[d.bloodType] || 0) + 1
        })

        return Object.entries(bloodTypeCount)
            .map(([type, count]) => ({
                name: type,
                value: count,
                color: BLOOD_TYPE_COLORS[type] || '#888888'
            }))
            .sort((a, b) => b.value - a.value)
    }

    // Validar formulario
    function validateForm(): boolean {
        const errors = {
            donorAddress: ''
        }

        if (!formData.donorAddress.trim()) {
            errors.donorAddress = 'La dirección del donante es requerida'
        } else if (!web3?.utils.isAddress(formData.donorAddress)) {
            errors.donorAddress = 'Dirección Ethereum inválida'
        }

        setFormErrors(errors)
        return !errors.donorAddress
    }

    // Manejar envío de formulario
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (validateForm()) {
            setShowConfirmModal(true)
        }
    }

    // Confirmar y crear donación
    async function handleConfirmDonation() {
        setShowConfirmModal(false)
        setIsSubmitting(true)

        const toastId = showTransactionPending()

        try {
            if (!contractTracker || !account) {
                throw new Error('Contrato no disponible')
            }

            // Registrar donación en el contrato BloodTracker
            const minDonationFee = await contractTracker.methods.MINIMUM_DONATION_FEE().call()

            const receipt = await contractTracker.methods
                .registerDonation(formData.donorAddress)
                .send({
                    from: account,
                    value: minDonationFee,
                    gas: 500000
                })

            showTransactionSuccess(receipt.transactionHash)
            showGenericSuccess('Donación registrada exitosamente')

            // Limpiar formulario
            setFormData({
                donorAddress: '',
                bloodType: 'A+'
            })

            // Recargar datos
            await loadData()
        } catch (error: any) {
            console.error('Error creating donation:', error)
            showTransactionError(error)
        } finally {
            setIsSubmitting(false)
        }
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
            console.error("Error loading donation center data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (account && web3) {
            loadData()
        }
    }, [account, web3, contractDonation, contractTracker])

    const bloodTypeChartData = prepareBloodTypeData(donations)

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
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    Dashboard Centro de Donación
                                </h1>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Tooltip content={account || ''}>
                                        <span className="flex items-center gap-2">
                                            <span className="font-semibold">Dirección:</span>
                                            <code className="px-2 py-1 bg-slate-100 rounded text-sm">
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
                                Centro Activo
                            </Badge>
                        </div>
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
                        icon={<CalendarIcon className="h-6 w-6" />}
                        label="Donaciones Hoy"
                        value={stats.today}
                        color="blockchain"
                    />
                    <Stat
                        icon={<ChartBarIcon className="h-6 w-6" />}
                        label="Donaciones Este Mes"
                        value={stats.thisMonth}
                        color="medical"
                    />
                    <Stat
                        icon={<BeakerIcon className="h-6 w-6" />}
                        label="Total Donaciones"
                        value={stats.total}
                        color="blood"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Formulario Nueva Donación */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card variant="elevated">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span>➕</span>
                                Nueva Donación
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="donorAddress" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Dirección del Donante *
                                    </label>
                                    <input
                                        type="text"
                                        id="donorAddress"
                                        value={formData.donorAddress}
                                        onChange={(e) => {
                                            setFormData({ ...formData, donorAddress: e.target.value })
                                            setFormErrors({ ...formErrors, donorAddress: '' })
                                        }}
                                        placeholder="0x..."
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all ${
                                            formErrors.donorAddress ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                        disabled={isSubmitting}
                                    />
                                    {formErrors.donorAddress && (
                                        <p className="mt-2 text-sm text-red-600">{formErrors.donorAddress}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="bloodType" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Tipo de Sangre (Referencia)
                                    </label>
                                    <select
                                        id="bloodType"
                                        value={formData.bloodType}
                                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                                        disabled={isSubmitting}
                                    >
                                        {BLOOD_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-xs text-slate-500">
                                        * Solo para referencia. El tipo de sangre no se guarda en blockchain.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? 'Registrando...' : 'Registrar Donación'}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </motion.div>

                {/* Gráfico Distribución por Tipo de Sangre */}
                {bloodTypeChartData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Card variant="elevated" className="h-full">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Distribución por Tipo de Sangre
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={bloodTypeChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {bloodTypeChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                padding: '12px'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Lista de Donaciones Recientes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Donaciones Recientes
                </h2>

                {donations.length === 0 ? (
                    <Card variant="elevated">
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">🩸</div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                No hay donaciones registradas
                            </h3>
                            <p className="text-slate-500">
                                Comienza registrando la primera donación usando el formulario.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {donations.slice(0, 10).map((donation, index) => (
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
                                                            Donante:
                                                        </p>
                                                        <Tooltip content={donation.donorAddress}>
                                                            <code className="text-sm font-semibold text-slate-900">
                                                                {truncateAddress(donation.donorAddress)}
                                                            </code>
                                                        </Tooltip>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-slate-600 mb-1">
                                                            Tipo de Sangre:
                                                        </p>
                                                        <Badge
                                                            status="completed"
                                                            variant="soft"
                                                            style={{ backgroundColor: BLOOD_TYPE_COLORS[donation.bloodType] + '20' }}
                                                        >
                                                            {donation.bloodType}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <Badge status="completed" variant="solid">
                                                    Registrada
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

            {/* Modal de Confirmación */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDonation}
                title="Confirmar Nueva Donación"
                message={
                    <div className="space-y-2">
                        <p>¿Deseas registrar esta donación?</p>
                        <div className="bg-slate-50 p-4 rounded-lg mt-4 space-y-2">
                            <p className="text-sm">
                                <span className="font-semibold">Donante:</span>{' '}
                                <code className="text-xs">{truncateAddress(formData.donorAddress)}</code>
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Tipo de Sangre:</span> {formData.bloodType}
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Esta acción creará una transacción en la blockchain.
                        </p>
                    </div>
                }
            />
        </div>
    )
}

export default DonationCenter
