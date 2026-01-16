'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEventsFromDonation, getEventsFromDerivative, getPatientAdministrations } from "@/lib/events"
import { motion } from "framer-motion"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress, formatDateTime, formatEther, getDerivativeTypeName } from "@/lib/helpers"
import { Derivative } from "@/lib/types"
import { ShoppingBagIcon, UserGroupIcon, CubeIcon } from '@heroicons/react/24/solid'
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons'
import AdministrationModal from '../hospital/AdministrationModal'

interface PurchaseInfo {
    tokenId: number
    tokenIdOrigin?: number
    isBloodBag: boolean
    derivativeType?: number
    purchaseDate: Date
    price: bigint
    seller: string
    transactionHash: string
}

interface AdministrationInfo {
    tokenId: number
    tokenIdOrigin?: number
    patientId: string
    medicalReason?: string
    administeredDate: Date
    isBloodBag: boolean
}

interface InventoryItem {
    tokenId: number
    type: 'blood_bag' | 'derivative'
    derivativeType?: number
    tokenIdOrigin?: number
}

const navigationCards = [
    {
        name: "Marketplace",
        description: "Comprar sangre y derivados",
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

function Hospital() {
    const { account, web3, contractDonation, contractDerivative, contractTracker } = useWallet()
    const [balance, setBalance] = useState<string>("0")
    const [purchases, setPurchases] = useState<PurchaseInfo[]>([])
    const [administrations, setAdministrations] = useState<AdministrationInfo[]>([])
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
    const [isAdministerModalOpen, setIsAdministerModalOpen] = useState(false)
    const [stats, setStats] = useState({
        totalPurchases: 0,
        itemsInStock: 0,
        patientsServed: 0
    })
    const router = useRouter()

    // Obtener compras realizadas por el hospital (BloodDonation + BloodDerivative)
    async function fetchPurchases() {
        if (!contractDonation || !contractDerivative || !contractTracker || !account || !web3) return []

        try {
            const arrPurchases: PurchaseInfo[] = []

            // Obtener el bloque actual
            const latestBlock = Number(await web3.eth.getBlockNumber())

            // Besu tiene un límite de rango, así que consultamos en chunks
            const CHUNK_SIZE = 1000

            // Calcular el bloque de inicio (últimos 10000 bloques o desde 0)
            const startBlock = Math.max(0, latestBlock - 10000)

            console.log(`Hospital: Querying from block ${startBlock} to ${latestBlock}`)

            // 1. Obtener compras de BloodDonation (bolsas completas) en chunks
            const allDonationTransfers: any[] = []

            for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
                const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

                try {
                    const events = await contractDonation.getPastEvents('Transfer', {
                        filter: { to: account },
                        fromBlock,
                        toBlock
                    })
                    allDonationTransfers.push(...events)
                } catch (chunkError) {
                    console.error(`Error fetching donation chunk ${fromBlock}-${toBlock}:`, chunkError)
                }
            }

            const donationTransfers = allDonationTransfers
            console.log(`Hospital: Found ${donationTransfers.length} donation transfers`)

            for (const event of donationTransfers) {
                const tokenId = Number(event.returnValues.tokenId)
                const from = String(event.returnValues.from)

                // Si 'from' no es address(0), es una compra
                if (from !== '0x0000000000000000000000000000000000000000') {
                    try {
                        const events = await getEventsFromDonation(tokenId)
                        const purchaseEvent = events.find(e =>
                            web3.utils.toChecksumAddress(e.owner) === web3.utils.toChecksumAddress(account)
                        ) || events[events.length - 1]

                        const txHash = event.transactionHash
                        const tx = await web3.eth.getTransaction(txHash)
                        const price = BigInt(tx.value || 0)

                        arrPurchases.push({
                            tokenId,
                            isBloodBag: true,
                            purchaseDate: purchaseEvent?.timestamp || new Date(),
                            price,
                            seller: from,
                            transactionHash: txHash
                        })
                    } catch (error) {
                        console.error(`Error processing donation token ${tokenId}:`, error)
                    }
                }
            }

            // 2. Obtener compras de BloodDerivative (derivados) en chunks
            const allDerivativeTransfers: any[] = []

            for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
                const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

                try {
                    const events = await contractDerivative.getPastEvents('Transfer', {
                        filter: { to: account },
                        fromBlock,
                        toBlock
                    })
                    allDerivativeTransfers.push(...events)
                } catch (chunkError) {
                    console.error(`Error fetching derivative chunk ${fromBlock}-${toBlock}:`, chunkError)
                }
            }

            const derivativeTransfers = allDerivativeTransfers
            console.log(`Hospital: Found ${derivativeTransfers.length} derivative transfers`)

            for (const event of derivativeTransfers) {
                const tokenId = Number(event.returnValues.tokenId)
                const from = String(event.returnValues.from)

                // Si 'from' no es address(0), es una compra
                if (from !== '0x0000000000000000000000000000000000000000') {
                    try {
                        const { tokenIdOrigin, derivative } = await contractDerivative.methods.products(tokenId).call()
                        const derivativeType = Number(derivative)

                        const events = await getEventsFromDerivative(tokenId)
                        const purchaseEvent = events.find(e =>
                            web3.utils.toChecksumAddress(e.owner) === web3.utils.toChecksumAddress(account)
                        ) || events[events.length - 1]

                        const txHash = event.transactionHash
                        const tx = await web3.eth.getTransaction(txHash)
                        const price = BigInt(tx.value || 0)

                        arrPurchases.push({
                            tokenId,
                            tokenIdOrigin: Number(tokenIdOrigin),
                            isBloodBag: false,
                            derivativeType,
                            purchaseDate: purchaseEvent?.timestamp || new Date(),
                            price,
                            seller: from,
                            transactionHash: txHash
                        })
                    } catch (error) {
                        console.error(`Error processing derivative token ${tokenId}:`, error)
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

    // Obtener inventario actual del hospital
    async function fetchInventory() {
        if (!contractDonation || !contractDerivative || !contractTracker || !account || !web3) return []

        try {
            const items: InventoryItem[] = []

            // Obtener el bloque actual
            const latestBlock = Number(await web3.eth.getBlockNumber())

            // Besu tiene un límite de rango, así que consultamos en chunks
            const CHUNK_SIZE = 1000

            // Calcular el bloque de inicio (últimos 10000 bloques o desde 0)
            const startBlock = Math.max(0, latestBlock - 10000)

            // 1. Obtener bolsas de sangre completas
            const bloodBagBalance = Number(await contractDonation.methods.balanceOf(account).call())

            if (bloodBagBalance > 0) {
                // Obtener todos los tokens del hospital en chunks
                const allDonationTransfersRaw: any[] = []

                for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
                    const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

                    try {
                        const events = await contractDonation.getPastEvents('Transfer', {
                            filter: { to: account },
                            fromBlock,
                            toBlock
                        })
                        allDonationTransfersRaw.push(...events)
                    } catch (chunkError) {
                        console.error(`Error fetching donation inventory chunk ${fromBlock}-${toBlock}:`, chunkError)
                    }
                }

                const allDonationTransfers = allDonationTransfersRaw

                for (const event of allDonationTransfers) {
                    const tokenId = Number(event.returnValues.tokenId)

                    try {
                        // Verificar si todavía es dueño
                        const owner = await contractDonation.methods.ownerOf(tokenId).call()
                        if (web3!.utils.toChecksumAddress(String(owner)) === web3!.utils.toChecksumAddress(account)) {
                            // Verificar si ya fue administrado a un paciente
                            const administration = await contractTracker.methods.administeredToPatients(tokenId).call()
                            const wasAdministered = Number(administration.timestamp) > 0

                            // Solo agregar si NO ha sido administrado
                            if (!wasAdministered) {
                                items.push({
                                    tokenId,
                                    type: 'blood_bag'
                                })
                            }
                        }
                    } catch (error) {
                        // Token no existe o fue quemado
                        continue
                    }
                }
            }

            // 2. Obtener derivados
            const derivativeBalance = Number(await contractDerivative.methods.balanceOf(account).call())

            if (derivativeBalance > 0) {
                const allDerivativeTransfersRaw: any[] = []

                for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
                    const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

                    try {
                        const events = await contractDerivative.getPastEvents('Transfer', {
                            filter: { to: account },
                            fromBlock,
                            toBlock
                        })
                        allDerivativeTransfersRaw.push(...events)
                    } catch (chunkError) {
                        console.error(`Error fetching derivative inventory chunk ${fromBlock}-${toBlock}:`, chunkError)
                    }
                }

                const allDerivativeTransfers = allDerivativeTransfersRaw

                for (const event of allDerivativeTransfers) {
                    const tokenId = Number(event.returnValues.tokenId)

                    try {
                        const owner = await contractDerivative.methods.ownerOf(tokenId).call()
                        if (web3!.utils.toChecksumAddress(String(owner)) === web3!.utils.toChecksumAddress(account)) {
                            // Verificar si ya fue administrado a un paciente
                            const administration = await contractTracker.methods.administeredToPatients(tokenId).call()
                            const wasAdministered = Number(administration.timestamp) > 0

                            // Solo agregar si NO ha sido administrado
                            if (!wasAdministered) {
                                const { tokenIdOrigin, derivative } = await contractDerivative.methods.products(tokenId).call()

                                items.push({
                                    tokenId,
                                    type: 'derivative',
                                    derivativeType: Number(derivative),
                                    tokenIdOrigin: Number(tokenIdOrigin)
                                })
                            }
                        }
                    } catch (error) {
                        continue
                    }
                }
            }

            return items
        } catch (error) {
            console.error("Error fetching inventory:", error)
            return []
        }
    }

    // Obtener administraciones a pacientes
    async function fetchAdministrations() {
        if (!contractTracker || !account || !contractDerivative) return []

        try {
            const data = await getPatientAdministrations(account)

            const result = []
            for (const item of data) {
                let tokenIdOrigin = undefined

                // Si es derivado, obtener tokenIdOrigin
                if (!item.isBloodBag) {
                    try {
                        const product = await contractDerivative.methods.products(item.tokenId).call()
                        tokenIdOrigin = Number(product.tokenIdOrigin)
                    } catch (error) {
                        console.error(`Error fetching tokenIdOrigin for derivative ${item.tokenId}:`, error)
                    }
                }

                result.push({
                    tokenId: item.tokenId,
                    tokenIdOrigin: tokenIdOrigin,
                    patientId: item.patientId,
                    medicalReason: item.medicalReason,
                    administeredDate: item.administeredDate,
                    isBloodBag: item.isBloodBag
                })
            }

            return result
        } catch (error) {
            console.error("Error fetching administrations:", error)
            return []
        }
    }

    // Calcular estadísticas
    function calculateStats(purchases: PurchaseInfo[], inventoryItems: InventoryItem[], administrations: AdministrationInfo[]) {
        setStats({
            totalPurchases: purchases.length,
            itemsInStock: inventoryItems.length,
            patientsServed: administrations.length
        })
    }

    // Manejar administración a paciente
    function handleAdminister(item: InventoryItem) {
        setSelectedItem(item)
        setIsAdministerModalOpen(true)
    }

    // Navegar a ruta
    function handleNavigate(path: string) {
        router.push(path)
    }

    // Obtener ID de donación para trazabilidad
    function getDonationId(item: { tokenId: number; tokenIdOrigin?: number; isBloodBag: boolean }): number {
        return item.isBloodBag ? item.tokenId : (item.tokenIdOrigin || item.tokenId)
    }

    // Navegar a trazabilidad
    function handleViewTrace(item: { tokenId: number; tokenIdOrigin?: number; isBloodBag: boolean }) {
        const donationId = getDonationId(item)
        router.push(`/trace/${donationId}`)
    }

    // Cargar datos
    async function loadData() {
        setIsLoading(true)
        try {
            if (account && web3) {
                const weiBalance = await web3.eth.getBalance(account)
                setBalance(formatEther(weiBalance))

                const purchasesData = await fetchPurchases()
                const inventoryData = await fetchInventory()
                const administrationsData = await fetchAdministrations()

                setPurchases(purchasesData)
                setInventory(inventoryData)
                setAdministrations(administrationsData)
                calculateStats(purchasesData, inventoryData, administrationsData)
            }
        } catch (error) {
            console.error("Error loading hospital data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Efecto inicial
    useEffect(() => {
        loadData()
    }, [account, web3, contractDonation, contractDerivative, contractTracker])

    // Renderizar icono según tipo de derivado
    function renderDerivativeIcon(type: number) {
        switch (type) {
            case Derivative.Plasma:
                return <PlasmaIcon className="w-8 h-8" />
            case Derivative.Erythrocytes:
                return <ErythrocytesIcon className="w-8 h-8" />
            case Derivative.Platelets:
                return <PlateletsIcon className="w-8 h-8" />
            default:
                return <CubeIcon className="w-8 h-8 text-slate-400" />
        }
    }

    // Renderizar skeleton mientras carga
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-64 mb-8" />
                <Grid cols={3} className="mb-8">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </Grid>
                <Skeleton className="h-64" />
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
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Dashboard del Hospital 🏥
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Gestión de sangre y derivados para uso médico
                </p>
            </motion.div>

            {/* Stats */}
            <Grid cols={3} className="mb-8">
                <Stat
                    label="Total Compras"
                    value={stats.totalPurchases.toString()}
                    icon={<ShoppingBagIcon className="w-8 h-8" />}
                    trend="neutral"
                />
                <Stat
                    label="Items en Stock"
                    value={stats.itemsInStock.toString()}
                    icon={<CubeIcon className="w-8 h-8" />}
                    trend="neutral"
                />
                <Stat
                    label="Pacientes Atendidos"
                    value={stats.patientsServed.toString()}
                    icon={<UserGroupIcon className="w-8 h-8" />}
                    trend="up"
                />
            </Grid>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
                <Grid cols={2}>
                    {navigationCards.map((card, index) => (
                        <motion.div
                            key={card.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card
                                onClick={() => handleNavigate(card.path)}
                                className="cursor-pointer hover:scale-105 transition-transform"
                            >
                                <div className={`bg-gradient-to-r ${card.gradient} p-6 rounded-lg text-white`}>
                                    <div className="text-4xl mb-2">{card.icon}</div>
                                    <h3 className="text-xl font-bold">{card.name}</h3>
                                    <p className="text-sm opacity-90">{card.description}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </Grid>
            </div>

            {/* Inventario Actual */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Inventario Actual</h2>
                <Grid cols={2}>
                    {/* Bolsas Completas */}
                    <Card>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            🩸 Bolsas Completas
                        </h3>
                        <div className="space-y-3">
                            {inventory.filter(item => item.type === 'blood_bag').length === 0 ? (
                                <p className="text-slate-500 text-sm">No hay bolsas en inventario</p>
                            ) : (
                                inventory.filter(item => item.type === 'blood_bag').map(item => (
                                    <div key={`blood_${item.tokenId}`} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-slate-800">Bolsa #{item.tokenId}</p>
                                                <Badge variant="success">Sangre Completa</Badge>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAdminister(item)}
                                            >
                                                Administrar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Derivados */}
                    <Card>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            🧪 Derivados
                        </h3>
                        <div className="space-y-3">
                            {inventory.filter(item => item.type === 'derivative').length === 0 ? (
                                <p className="text-slate-500 text-sm">No hay derivados en inventario</p>
                            ) : (
                                inventory.filter(item => item.type === 'derivative').map(item => (
                                    <div key={`deriv_${item.tokenId}`} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {renderDerivativeIcon(item.derivativeType || 0)}
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {getDerivativeTypeName(item.derivativeType || 0)} #{item.tokenId}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Origen: #{item.tokenIdOrigin}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAdminister(item)}
                                            >
                                                Administrar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </Grid>
            </div>

            {/* Historial de Compras */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Historial de Compras</h2>
                <Card>
                    {purchases.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No hay compras registradas</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Tipo</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Token ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Fecha</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Precio</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendedor</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchases.map((purchase, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                {purchase.isBloodBag ? (
                                                    <Badge variant="success">Sangre Completa</Badge>
                                                ) : (
                                                    <Badge variant="info">{getDerivativeTypeName(purchase.derivativeType || 0)}</Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-sm">#{purchase.tokenId}</td>
                                            <td className="py-3 px-4 text-sm">{formatDateTime(purchase.purchaseDate)}</td>
                                            <td className="py-3 px-4 font-semibold">{formatEther(purchase.price)} ETH</td>
                                            <td className="py-3 px-4 font-mono text-xs">{truncateAddress(purchase.seller)}</td>
                                            <td className="py-3 px-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewTrace(purchase)}
                                                >
                                                    🔍 Ver Trazabilidad
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Historial de Administraciones */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Historial de Administraciones a Pacientes</h2>
                <Card>
                    {administrations.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No hay administraciones registradas</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Token ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Tipo</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Patient ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Fecha</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {administrations.map((admin, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-mono text-sm">#{admin.tokenId}</td>
                                            <td className="py-3 px-4">
                                                {admin.isBloodBag ? (
                                                    <Badge variant="success">Sangre Completa</Badge>
                                                ) : (
                                                    <Badge variant="info">Derivado</Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-xs">{truncateAddress(admin.patientId)}</td>
                                            <td className="py-3 px-4 text-sm">{formatDateTime(admin.administeredDate)}</td>
                                            <td className="py-3 px-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewTrace(admin)}
                                                >
                                                    🔍 Ver Trazabilidad
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Modal de Administración */}
            <AdministrationModal
                isOpen={isAdministerModalOpen}
                onClose={() => setIsAdministerModalOpen(false)}
                onSuccess={loadData}
                item={selectedItem}
            />
        </div>
    )
}

export default Hospital
