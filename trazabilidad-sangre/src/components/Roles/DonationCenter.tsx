'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
    currentOwner?: string
    ownerName?: string
    isOwned?: boolean
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
    }
]

interface Laboratory {
    address: string
    name: string
    location: string
}

function DonationCenter() {
    const { account, web3, contractTracker, contractDonation } = useWallet()
    const router = useRouter()
    const [balance, setBalance] = useState<string>("0")
    const [donations, setDonations] = useState<DonationInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [selectedDonationId, setSelectedDonationId] = useState<number | null>(null)
    const [laboratories, setLaboratories] = useState<Laboratory[]>([])
    const [selectedLab, setSelectedLab] = useState<string>("")
    const [isTransferring, setIsTransferring] = useState(false)
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
        if (!contractTracker || !account || !web3 || !contractDonation) return []

        try {
            const arrDonations: DonationInfo[] = []

            // Obtener DIRECTAMENTE los eventos Donation del BloodTracker filtrados por este centro
            // Esto es MUCHO más eficiente que el método anterior
            const donationEvents = await contractTracker.getPastEvents('Donation', {
                filter: { center: account },
                fromBlock: 0,
                toBlock: 'latest'
            })

            console.log(`Found ${donationEvents.length} donations for center ${account}`)

            // Obtener info del centro UNA SOLA VEZ (fuera del loop)
            const centerInfo = await contractTracker.methods.companies(account).call()
            const centerLocation = String(centerInfo.location)

            // Para cada evento, extraer la información necesaria
            for (const event of donationEvents) {
                const tokenId = Number(event.returnValues.tokenId)
                const donorAddress = String(event.returnValues.donor)

                try {
                    // Obtener el timestamp del bloque
                    const block = await web3.eth.getBlock(event.blockHash)
                    const timestamp = new Date(Number(block.timestamp) * 1000)

                    // Simular tipo de sangre basado en tokenId (en producción vendría de metadata)
                    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                    const bloodType = bloodTypes[tokenId % bloodTypes.length]

                    // Verificar el owner actual del NFT
                    let currentOwner = ''
                    let ownerName = ''
                    let isOwned = false

                    try {
                        currentOwner = await contractDonation.methods.ownerOf(tokenId).call()
                        isOwned = web3.utils.toChecksumAddress(currentOwner) === web3.utils.toChecksumAddress(account)

                        // Si no es del centro, obtener info del owner
                        if (!isOwned) {
                            const ownerCompany = await contractTracker.methods.companies(currentOwner).call()
                            ownerName = String(ownerCompany.name) || 'Desconocido'
                        }
                    } catch (error) {
                        // El NFT fue quemado (procesado)
                        console.log(`NFT ${tokenId} was burned (processed)`)
                        currentOwner = 'BURNED'
                        ownerName = 'Procesado'
                        isOwned = false
                    }

                    arrDonations.push({
                        tokenId,
                        donationDate: timestamp,
                        donorAddress: donorAddress,
                        bloodType,
                        location: centerLocation,
                        currentOwner,
                        ownerName,
                        isOwned
                    })
                } catch (error) {
                    console.error(`Error processing donation ${tokenId}:`, error)
                }
            }

            // Ordenar por tokenId descendente (más reciente primero)
            arrDonations.sort((a, b) => b.tokenId - a.tokenId)

            console.log(`Processed ${arrDonations.length} donations successfully`)

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
            const minDonationFee = await contractTracker.methods.getMinimumDonationFee().call()

            // VALIDACIÓN: Verificar si el donante ya tiene un rol de empresa
            const donorCompany = await contractTracker.methods.companies(formData.donorAddress).call()
            const donorCompanyRole = Number(donorCompany.role)

            if (donorCompanyRole !== 0) {
                showTransactionError({
                    message: "Esta wallet ya está registrada como empresa. Una empresa no puede donar sangre."
                })
                setIsSubmitting(false)
                return
            }

            const receipt = await contractTracker.methods
                .donate(formData.donorAddress)
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

    // Obtener lista de laboratorios registrados
    async function fetchLaboratories() {
        if (!contractTracker) return []

        try {
            console.log('Buscando laboratorios registrados...')

            // Obtener eventos de registro aprobado para laboratorios
            const approvalEvents = await contractTracker.getPastEvents('RequestApproved', {
                fromBlock: 0,
                toBlock: 'latest'
            })

            console.log(`Found ${approvalEvents.length} RequestApproved events`)

            const labs: Laboratory[] = []

            for (const event of approvalEvents) {
                const applicant = String(event.returnValues.applicant)
                const role = Number(event.returnValues.role)

                console.log(`Event: applicant=${applicant}, role=${role}`)

                // Solo laboratorios (Role.LABORATORY = 2)
                if (role === 2) {
                    const company = await contractTracker.methods.companies(applicant).call()
                    const companyStatus = Number(company.status)

                    console.log(`Laboratory found: ${company.name}, status=${companyStatus}`)

                    // Solo agregar si está aprobado (status = 2)
                    if (companyStatus === 2) {
                        labs.push({
                            address: applicant,
                            name: String(company.name),
                            location: String(company.location)
                        })
                    }
                }
            }

            console.log(`Total laboratories approved: ${labs.length}`, labs)

            setLaboratories(labs)
            return labs
        } catch (error) {
            console.error("Error fetching laboratories:", error)
            return []
        }
    }

    // Manejar click en transferir
    function handleTransferClick(tokenId: number) {
        setSelectedDonationId(tokenId)
        setShowTransferModal(true)
    }

    // Confirmar transferencia
    async function handleConfirmTransfer() {
        if (!selectedLab || !selectedDonationId || !contractDonation || !account) {
            showTransactionError({ message: "Selecciona un laboratorio" })
            return
        }

        setShowTransferModal(false)
        setIsTransferring(true)

        const toastId = showTransactionPending()

        try {
            // Transferir el NFT usando safeTransferFrom
            const receipt = await contractDonation.methods
                .safeTransferFrom(account, selectedLab, selectedDonationId)
                .send({
                    from: account,
                    gas: 300000
                })

            showTransactionSuccess(receipt.transactionHash)
            showGenericSuccess('Donación transferida exitosamente al laboratorio')

            // Limpiar selección
            setSelectedLab("")
            setSelectedDonationId(null)

            // Recargar datos
            await loadData()
        } catch (error: any) {
            console.error('Error transferring donation:', error)
            showTransactionError(error)
        } finally {
            setIsTransferring(false)
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

                // Cargar laboratorios para transferencias
                await fetchLaboratories()
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
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard Centro de Donación
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

                                {/* Estadísticas en formato de tabla */}
                                <div className="space-y-3">
                                    {bloodTypeChartData.map((item, index) => {
                                        const percentage = (item.value / donations.length * 100).toFixed(1)
                                        return (
                                            <div key={index} className="flex items-center gap-4">
                                                <div
                                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div className="flex-1 flex items-center gap-3">
                                                    <span className="font-bold text-slate-900 w-12">
                                                        {item.name}
                                                    </span>
                                                    <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                                                        <div
                                                            className="h-full flex items-center justify-end pr-3 text-xs font-semibold text-white transition-all duration-500"
                                                            style={{
                                                                width: `${percentage}%`,
                                                                backgroundColor: item.color,
                                                                minWidth: '40px'
                                                            }}
                                                        >
                                                            {percentage}%
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-600 w-12 text-right">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-700">Total</span>
                                        <span className="text-lg font-bold text-slate-900">{donations.length} donaciones</span>
                                    </div>
                                </div>
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
                                                        <span
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                                                            style={{
                                                                backgroundColor: BLOOD_TYPE_COLORS[donation.bloodType] + '30',
                                                                color: BLOOD_TYPE_COLORS[donation.bloodType],
                                                                border: `2px solid ${BLOOD_TYPE_COLORS[donation.bloodType]}`
                                                            }}
                                                        >
                                                            {donation.bloodType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {donation.isOwned ? (
                                                    <>
                                                        <Badge status="completed" variant="solid">
                                                            En Inventario
                                                        </Badge>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleTransferClick(donation.tokenId)}
                                                            disabled={isTransferring}
                                                        >
                                                            Transferir a Laboratorio
                                                        </Button>
                                                    </>
                                                ) : donation.currentOwner === 'BURNED' ? (
                                                    <div className="text-right">
                                                        <Badge status="processing" variant="solid">
                                                            Procesado
                                                        </Badge>
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            NFT quemado
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-right">
                                                        <Badge status="pending" variant="solid">
                                                            Transferida
                                                        </Badge>
                                                        <p className="text-xs text-slate-600 mt-2">
                                                            <span className="font-semibold">A:</span> {donation.ownerName}
                                                        </p>
                                                        <Tooltip content={donation.currentOwner || ''}>
                                                            <code className="text-xs text-slate-500">
                                                                {truncateAddress(donation.currentOwner || '')}
                                                            </code>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Modal de Confirmación - Nueva Donación */}
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

            {/* Modal de Transferencia a Laboratorio */}
            <ConfirmModal
                isOpen={showTransferModal}
                onClose={() => {
                    setShowTransferModal(false)
                    setSelectedLab("")
                    setSelectedDonationId(null)
                }}
                onConfirm={handleConfirmTransfer}
                title="Transferir Donación a Laboratorio"
                confirmText="Transferir"
                cancelText="Cancelar"
                message={
                    <div className="space-y-4">
                        <p>Selecciona el laboratorio al que deseas transferir la donación #{selectedDonationId}</p>

                        {laboratories.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ No hay laboratorios registrados en el sistema
                                </p>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="laboratory" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Laboratorio *
                                </label>
                                <select
                                    id="laboratory"
                                    value={selectedLab}
                                    onChange={(e) => setSelectedLab(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blood-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Selecciona un laboratorio...</option>
                                    {laboratories.map((lab) => (
                                        <option key={lab.address} value={lab.address}>
                                            {lab.name} - {lab.location}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedLab && (
                            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold">Laboratorio:</span>{' '}
                                    {laboratories.find(l => l.address === selectedLab)?.name}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Dirección:</span>{' '}
                                    <code className="text-xs">{truncateAddress(selectedLab)}</code>
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-slate-500">
                            Esta acción transferirá el NFT de la donación al laboratorio seleccionado.
                        </p>
                    </div>
                }
            />
        </div>
    )
}

export default DonationCenter
