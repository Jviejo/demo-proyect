'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEventsFromDerivative } from "@/lib/events"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress, formatDate, formatDateTime, formatEther, getDerivativeTypeName } from "@/lib/helpers"
import { Tooltip } from "../ui/Tooltip"
import { Derivative } from "@/lib/types"
import { ShoppingCartIcon, CurrencyDollarIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid'
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons'
import { ListItemModal } from '../marketplace/ListItemModal'

interface PurchaseInfo {
    tokenId: number
    tokenIdOrigin: number
    derivativeType: number
    purchaseDate: Date
    price: bigint
    seller: string
    transactionHash: string
}

const navigationCards = [
    {
        name: "Marketplace",
        description: "Comprar derivados de sangre",
        icon: "🛒",
        path: "/marketplace",
        gradient: "from-blockchain-500 to-blockchain-700"
    },
    {
        name: "Trazabilidad",
        description: "Rastrear productos",
        icon: "🔍",
        path: "/trace",
        gradient: "from-medical-500 to-medical-700"
    }
]

function Trader() {
    const { account, web3, contractDerivative, contractTracker } = useWallet()
    const [balance, setBalance] = useState<string>("0")
    const [purchases, setPurchases] = useState<PurchaseInfo[]>([])
    const [inventory, setInventory] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isListItemModalOpen, setIsListItemModalOpen] = useState(false)
    const [stats, setStats] = useState({
        totalPurchases: 0,
        totalSpent: '0',
        inventoryCount: 0
    })
    const router = useRouter()

    // Obtener compras realizadas por el trader
    async function fetchPurchases() {
        if (!contractDerivative || !contractTracker || !account) return []

        try {
            const arrPurchases: PurchaseInfo[] = []

            // Obtener todos los eventos Transfer donde 'to' es el trader actual
            const transferEvents = await contractDerivative.getPastEvents('Transfer', {
                filter: { to: account },
                fromBlock: 0,
                toBlock: 'latest'
            })

            // Para cada evento, verificar si fue una compra (no un mint)
            for (const event of transferEvents) {
                const tokenId = Number(event.returnValues.tokenId)
                const from = String(event.returnValues.from)

                // Si 'from' no es address(0), entonces es una transferencia (compra)
                if (from !== '0x0000000000000000000000000000000000000000') {
                    try {
                        // Obtener info del derivado
                        const { tokenIdOrigin, derivative } = await contractDerivative.methods.products(tokenId).call()
                        const derivativeType = Number(derivative)

                        // Obtener eventos para info adicional
                        const events = await getEventsFromDerivative(tokenId)
                        const purchaseEvent = events.find(e =>
                            web3!.utils.toChecksumAddress(e.owner) === web3!.utils.toChecksumAddress(account)
                        ) || events[events.length - 1]

                        // Obtener info de la transacción
                        const txHash = event.transactionHash
                        const tx = await web3!.eth.getTransaction(txHash)
                        const price = BigInt(tx.value || 0)

                        arrPurchases.push({
                            tokenId,
                            tokenIdOrigin: Number(tokenIdOrigin),
                            derivativeType,
                            purchaseDate: purchaseEvent?.timestamp || new Date(),
                            price,
                            seller: from,
                            transactionHash: txHash
                        })
                    } catch (error) {
                        console.error(`Error processing token ${tokenId}:`, error)
                    }
                }
            }

            // Ordenar por fecha descendente
            arrPurchases.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())

            return arrPurchases
        } catch (error) {
            console.error("Error fetching purchases:", error)
            return []
        }
    }

    // Obtener inventario actual
    async function fetchInventory() {
        if (!contractDerivative || !account) return 0

        try {
            const balance = await contractDerivative.methods.balanceOf(account).call()
            return Number(balance)
        } catch (error) {
            console.error("Error fetching inventory:", error)
            return 0
        }
    }

    // Calcular estadísticas
    function calculateStats(purchases: PurchaseInfo[], inventoryCount: number) {
        const totalPurchases = purchases.length
        const totalSpentWei = purchases.reduce((sum, p) => sum + p.price, BigInt(0))
        const totalSpent = formatEther(totalSpentWei)

        setStats({
            totalPurchases,
            totalSpent,
            inventoryCount
        })
    }

    // Preparar datos para gráfico de compras por mes
    function preparePurchasesChartData(purchases: PurchaseInfo[]) {
        const purchasesByMonth: { [key: string]: number } = {}

        purchases.forEach(p => {
            const monthYear = `${p.purchaseDate.getMonth() + 1}/${p.purchaseDate.getFullYear()}`
            purchasesByMonth[monthYear] = (purchasesByMonth[monthYear] || 0) + 1
        })

        return Object.entries(purchasesByMonth)
            .map(([month, count]) => ({ mes: month, compras: count }))
            .sort((a, b) => {
                const [monthA, yearA] = a.mes.split('/').map(Number)
                const [monthB, yearB] = b.mes.split('/').map(Number)
                return yearA !== yearB ? yearA - yearB : monthA - monthB
            })
    }

    // Navegar a ruta
    function handleNavigate(path: string) {
        router.push(path)
    }

    // Manejar éxito de listado
    async function handleListItemSuccess() {
        await loadData()
    }

    // Cargar datos
    async function loadData() {
        setIsLoading(true)
        try {
            if (account && web3) {
                const weiBalance = await web3.eth.getBalance(account)
                setBalance(formatEther(weiBalance))

                const purchasesData = await fetchPurchases()
                const inventoryCount = await fetchInventory()

                setPurchases(purchasesData)
                setInventory(inventoryCount)
                calculateStats(purchasesData, inventoryCount)
            }
        } catch (error) {
            console.error("Error loading trader data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (account && web3) {
            loadData()
        }
    }, [account, web3, contractDerivative, contractTracker])

    const chartData = preparePurchasesChartData(purchases)

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
                            Dashboard del Trader
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
                        icon={<ShoppingCartIcon className="h-6 w-6" />}
                        label="Total Compras"
                        value={stats.totalPurchases}
                        color="blockchain"
                    />
                    <Stat
                        icon={<CurrencyDollarIcon className="h-6 w-6" />}
                        label="Gasto Total"
                        value={`${stats.totalSpent} TAS`}
                        color="medical"
                    />
                    <Stat
                        icon={<ArchiveBoxIcon className="h-6 w-6" />}
                        label="Items en Inventario"
                        value={stats.inventoryCount}
                        color="blood"
                    />
                </Grid>
            </motion.div>

            {/* Cards de Navegación */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                onClick={() => handleNavigate(card.path)}
                            >
                                <div className={`bg-gradient-to-br ${card.gradient} p-8 rounded-t-xl`}>
                                    <div className="text-6xl mb-4">{card.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {card.name}
                                    </h3>
                                    <p className="text-white/90">
                                        {card.description}
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-b-xl">
                                    <Button variant="ghost" size="sm" className="w-full">
                                        Ir a {card.name} →
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Gráfico de Compras por Mes */}
            {chartData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-8"
                >
                    <Card variant="elevated">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Historial de Compras por Mes
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="mes"
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
                                        dataKey="compras"
                                        stroke="#32cd32"
                                        strokeWidth={3}
                                        dot={{ fill: '#32cd32', r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Historial de Compras */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Historial de Compras
                </h2>

                {purchases.length === 0 ? (
                    <Card variant="elevated">
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                No hay compras registradas
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Todavía no has realizado ninguna compra en el marketplace.
                            </p>
                            <Button variant="primary" onClick={() => handleNavigate('/marketplace')}>
                                Ir al Marketplace
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {purchases.map((purchase, index) => (
                            <motion.div
                                key={purchase.transactionHash}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                className="w-full p-4 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-row items-center gap-4 hover:border-primary-300"
                            >
                                {/* Icon and Product */}
                                <div className="flex items-center gap-2 min-w-[160px]">
                                    {purchase.derivativeType === Derivative.Plasma && <PlasmaIcon />}
                                    {purchase.derivativeType === Derivative.Erythrocytes && <ErythrocytesIcon />}
                                    {purchase.derivativeType === Derivative.Platelets && <PlateletsIcon />}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {getDerivativeTypeName(purchase.derivativeType)} #{purchase.tokenId}
                                        </h3>
                                        <Badge status="completed" variant="solid" className="mt-1 scale-75 origin-left">
                                            Completado
                                        </Badge>
                                    </div>
                                </div>

                                {/* Purchase Info - Compact */}
                                <div className="flex-1 flex items-center gap-4 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-700">
                                            {formatDate(purchase.purchaseDate)}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-sm font-bold text-success-600">
                                            {formatEther(purchase.price, 4)} ETH
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <Tooltip content={purchase.seller}>
                                            <span className="text-xs font-mono text-slate-600">
                                                Vendedor: {truncateAddress(purchase.seller, 4, 4)}
                                            </span>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => setIsListItemModalOpen(true)}
                                        className="text-xs"
                                    >
                                        💼 Vender
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleNavigate(`/trace/${purchase.tokenIdOrigin}`)}
                                        className="text-xs"
                                    >
                                        Ver Trazabilidad
                                        <svg className="w-3 h-3 ms-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                                        </svg>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Modal para listar producto */}
            <ListItemModal
                isOpen={isListItemModalOpen}
                onClose={() => setIsListItemModalOpen(false)}
                onSuccess={handleListItemSuccess}
            />
        </div>
    )
}

export default Trader
