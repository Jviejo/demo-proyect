'use client'

import { useWallet } from "../ConnectWalletButton"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEventsFromDerivative, getManufacturedBatches } from "@/lib/events"
import { motion } from "framer-motion"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress, formatDateTime, formatEther, getDerivativeTypeName, getProductTypeName } from "@/lib/helpers"
import { Derivative } from "@/lib/types"
import { ShoppingBagIcon, CubeIcon, BeakerIcon } from '@heroicons/react/24/solid'
import { PlasmaIcon, ErythrocytesIcon, PlateletsIcon } from '../ProductIcons'
import CreateBatchModal from '../manufacturer/CreateBatchModal'

interface PurchaseInfo {
    tokenId: number
    tokenIdOrigin: number
    derivativeType: number
    purchaseDate: Date
    price: bigint
    seller: string
    transactionHash: string
}

interface BatchInfo {
    batchId: number
    derivativeIds: number[]
    derivativeOrigins: number[] // tokenIdOrigin de cada derivado
    productType: string
    createdDate: Date
    derivativesCount: number
}

interface InventoryItem {
    tokenId: number
    derivativeType: number
    tokenIdOrigin: number
    isUsedInBatch: boolean
}

const navigationCards = [
    {
        name: "Marketplace",
        description: "Comprar derivados sanguíneos",
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

function Manufacturer() {
    const { account, web3, contractDerivative, contractTracker } = useWallet()
    const [balance, setBalance] = useState<string>("0")
    const [purchases, setPurchases] = useState<PurchaseInfo[]>([])
    const [batches, setBatches] = useState<BatchInfo[]>([])
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false)
    const [stats, setStats] = useState({
        totalPurchases: 0,
        batchesCreated: 0,
        derivativesInStock: 0
    })
    const router = useRouter()

    // Obtener compras realizadas por el manufacturer (solo derivados)
    async function fetchPurchases() {
        if (!contractDerivative || !contractTracker || !account || !web3) return []

        try {
            const arrPurchases: PurchaseInfo[] = []

            // Obtener el bloque actual
            const latestBlock = Number(await web3.eth.getBlockNumber())

            // Besu tiene un límite de rango, así que consultamos en chunks
            const CHUNK_SIZE = 1000

            // Calcular el bloque de inicio (últimos 10000 bloques o desde 0)
            const startBlock = Math.max(0, latestBlock - 10000)

            console.log(`Manufacturer: Querying derivative transfers from block ${startBlock} to ${latestBlock}`)

            // Obtener compras de BloodDerivative en chunks
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
            console.log(`Manufacturer: Found ${derivativeTransfers.length} derivative transfers`)

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

    // Obtener inventario actual del manufacturer (derivados no usados en lotes)
    async function fetchInventory() {
        if (!contractDerivative || !contractTracker || !account || !web3) return []

        try {
            const items: InventoryItem[] = []

            // Obtener el bloque actual
            const latestBlock = Number(await web3.eth.getBlockNumber())

            // Besu tiene un límite de rango, así que consultamos en chunks
            const CHUNK_SIZE = 1000

            // Calcular el bloque de inicio (últimos 10000 bloques o desde 0)
            const startBlock = Math.max(0, latestBlock - 10000)

            // Obtener balance de derivados
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
                        if (web3.utils.toChecksumAddress(String(owner)) === web3.utils.toChecksumAddress(account)) {
                            const { tokenIdOrigin, derivative } = await contractDerivative.methods.products(tokenId).call()

                            // Verificar si el derivado fue usado en un lote
                            const isUsed = await contractTracker.methods.derivativesUsedInBatch(tokenId).call()

                            items.push({
                                tokenId,
                                derivativeType: Number(derivative),
                                tokenIdOrigin: Number(tokenIdOrigin),
                                isUsedInBatch: Boolean(isUsed)
                            })
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

    // Obtener lotes manufacturados creados
    async function fetchBatches() {
        if (!contractTracker || !account || !contractDerivative) return []

        try {
            const data = await getManufacturedBatches(account)

            const result = []
            for (const item of data) {
                // Obtener tokenIdOrigin de cada derivado en el lote
                const origins = []
                for (const derivId of item.derivativeIds) {
                    try {
                        const product = await contractDerivative.methods.products(derivId).call()
                        origins.push(Number(product.tokenIdOrigin))
                    } catch (error) {
                        console.error(`Error fetching origin for derivative ${derivId}:`, error)
                        origins.push(0) // Fallback
                    }
                }

                result.push({
                    batchId: item.batchId,
                    derivativeIds: item.derivativeIds,
                    derivativeOrigins: origins,
                    productType: item.productType,
                    createdDate: item.timestamp,
                    derivativesCount: item.derivativeIds.length
                })
            }

            return result
        } catch (error) {
            console.error("Error fetching batches:", error)
            return []
        }
    }

    // Calcular estadísticas
    function calculateStats(purchases: PurchaseInfo[], inventoryItems: InventoryItem[], batches: BatchInfo[]) {
        // Contar derivados disponibles (no usados en lotes)
        const availableDerivatives = inventoryItems.filter(item => !item.isUsedInBatch).length

        setStats({
            totalPurchases: purchases.length,
            batchesCreated: batches.length,
            derivativesInStock: availableDerivatives
        })
    }

    // Manejar creación de lote
    function handleCreateBatch() {
        setIsCreateBatchModalOpen(true)
    }

    // Navegar a ruta
    function handleNavigate(path: string) {
        router.push(path)
    }

    // Navegar a trazabilidad desde tokenIdOrigin
    function handleViewTrace(tokenIdOrigin: number) {
        router.push(`/trace/${tokenIdOrigin}`)
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
                const batchesData = await fetchBatches()

                setPurchases(purchasesData)
                setInventory(inventoryData)
                setBatches(batchesData)
                calculateStats(purchasesData, inventoryData, batchesData)
            }
        } catch (error) {
            console.error("Error loading manufacturer data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Efecto inicial
    useEffect(() => {
        loadData()
    }, [account, web3, contractDerivative, contractTracker])

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
                    Dashboard del Manufacturer 🧴
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Producción de cosméticos y productos biotecnológicos
                </p>
            </motion.div>

            {/* Stats */}
            <Grid cols={3} className="mb-8">
                <Stat
                    label="Derivados Comprados"
                    value={stats.totalPurchases.toString()}
                    icon={<ShoppingBagIcon className="w-8 h-8" />}
                    trend="neutral"
                />
                <Stat
                    label="Lotes Creados"
                    value={stats.batchesCreated.toString()}
                    icon={<BeakerIcon className="w-8 h-8" />}
                    trend="up"
                />
                <Stat
                    label="Derivados en Stock"
                    value={stats.derivativesInStock.toString()}
                    icon={<CubeIcon className="w-8 h-8" />}
                    trend="neutral"
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

            {/* Inventario de Derivados */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Inventario de Derivados</h2>
                    <Button onClick={handleCreateBatch} disabled={inventory.filter(i => !i.isUsedInBatch).length === 0}>
                        Crear Nuevo Lote
                    </Button>
                </div>
                <Card>
                    <Grid cols={3}>
                        {inventory.filter(item => !item.isUsedInBatch).length === 0 ? (
                            <div className="col-span-3">
                                <p className="text-slate-500 text-center py-8">No hay derivados disponibles en inventario</p>
                            </div>
                        ) : (
                            inventory.filter(item => !item.isUsedInBatch).map(item => (
                                <div key={`deriv_${item.tokenId}`} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {renderDerivativeIcon(item.derivativeType)}
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">
                                                {getDerivativeTypeName(item.derivativeType)} #{item.tokenId}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Origen: Donación #{item.tokenIdOrigin}
                                            </p>
                                            <Badge variant="success" className="mt-2">Disponible</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Grid>
                </Card>
            </div>

            {/* Derivados Usados en Lotes */}
            {inventory.filter(item => item.isUsedInBatch).length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Derivados Usados en Lotes</h2>
                    <Card>
                        <Grid cols={3}>
                            {inventory.filter(item => item.isUsedInBatch).map(item => (
                                <div key={`used_${item.tokenId}`} className="border border-slate-200 rounded-lg p-4 bg-slate-50 opacity-75">
                                    <div className="flex items-start gap-3">
                                        {renderDerivativeIcon(item.derivativeType)}
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-600">
                                                {getDerivativeTypeName(item.derivativeType)} #{item.tokenId}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Origen: Donación #{item.tokenIdOrigin}
                                            </p>
                                            <Badge variant="warning" className="mt-2">Usado en Lote</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Grid>
                    </Card>
                </div>
            )}

            {/* Lotes de Productos Creados */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Lotes de Productos Creados</h2>
                <Card>
                    {batches.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No hay lotes creados</p>
                    ) : (
                        <div className="space-y-4">
                            {batches.map((batch, index) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                Lote #{batch.batchId}
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                {getProductTypeName(batch.productType)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="info">{batch.derivativesCount} derivados</Badge>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {formatDateTime(batch.createdDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-3">
                                        <p className="text-sm text-slate-600 mb-2 font-semibold">Derivados utilizados:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {batch.derivativeIds.map((id, idx) => (
                                                <Badge
                                                    key={id}
                                                    variant="default"
                                                    className="font-mono text-xs cursor-pointer hover:bg-slate-600 transition-colors"
                                                    onClick={() => handleViewTrace(batch.derivativeOrigins[idx])}
                                                >
                                                    #{id} 🔍
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Click en un derivado para ver su trazabilidad</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
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
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Origen</th>
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
                                                <Badge variant="info">{getDerivativeTypeName(purchase.derivativeType)}</Badge>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-sm">#{purchase.tokenId}</td>
                                            <td className="py-3 px-4 font-mono text-xs">#{purchase.tokenIdOrigin}</td>
                                            <td className="py-3 px-4 text-sm">{formatDateTime(purchase.purchaseDate)}</td>
                                            <td className="py-3 px-4 font-semibold">{formatEther(purchase.price)} ETH</td>
                                            <td className="py-3 px-4 font-mono text-xs">{truncateAddress(purchase.seller)}</td>
                                            <td className="py-3 px-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewTrace(purchase.tokenIdOrigin)}
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

            {/* Modal de Crear Lote */}
            <CreateBatchModal
                isOpen={isCreateBatchModalOpen}
                onClose={() => setIsCreateBatchModalOpen(false)}
                onSuccess={loadData}
                availableDerivatives={inventory.filter(item => !item.isUsedInBatch)}
            />
        </div>
    )
}

export default Manufacturer
