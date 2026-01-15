'use client'

import { useEffect, useState } from "react"
import { useWallet } from "../ConnectWalletButton"
import { getEventsFromDerivative, getTraceFromDonation } from "@/lib/events"
import { DerivateCard } from "../LabComponents/DerivateCard"
import { BloodCard } from "../LabComponents/BloodCard"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Skeleton } from "../ui/Skeleton"
import { Stat } from "../ui/Stat"
import Grid from "../ui/Grid"
import { truncateAddress } from "@/lib/helpers"
import { BeakerIcon, CubeIcon, ShoppingBagIcon } from '@heroicons/react/24/solid'

export default function Laboratory() {
    const { web3, account, contractTracker, contractDonation, contractDerivative } = useWallet()
    const [donationTokens, setDonationTokens] = useState<Awaited<ReturnType<typeof getDonationTokens>>>([])
    const [derivativeTokens, setDerivativeTokens] = useState<Awaited<ReturnType<typeof getDerivativeTokens>>>([])
    const [listedDerivatives, setListedDerivatives] = useState<Awaited<ReturnType<typeof getListedDerivatives>>>([])
    const [isLoading, setIsLoading] = useState(true)

    async function getDonationTokens() {
        const arrDonationTokens = []
        const numTokens = await contractDonation!.methods.balanceOf(account).call()
        for (let i = 0; i < Number(numTokens); i++){
            const tokenId = await contractDonation!.methods.tokenOfOwnerByIndex(account, i).call()
            const {donationTrace} = await getTraceFromDonation(Number(tokenId))
            arrDonationTokens.push({
                tokenId: Number(tokenId),
                extractionDatetime: donationTrace!.trace[0].timestamp,
                donationCenterAddress: donationTrace!.trace[0].owner,
                donationCenterName: donationTrace!.trace[0].name,
                donationCenterLocation: donationTrace!.trace[0].location
            })
        }
        setDonationTokens(arrDonationTokens)
        return arrDonationTokens
    }

    async function getDerivativeTokens(){
        const arrDerivativeTokens = []
        const numTokens = await contractDerivative!.methods.balanceOf(account).call()
        for (let i = 0; i < Number(numTokens); i++){
            const tokenId = await contractDerivative!.methods.tokenOfOwnerByIndex(account, i).call()
            const {tokenIdOrigin, derivative} = await contractDerivative!.methods.products(tokenId).call()
            const events = await getEventsFromDerivative(Number(tokenId))
            arrDerivativeTokens.push({
                tokenId: Number(tokenId),
                type: Number(derivative),
                processDate: events[0].timestamp,
                tokenIdOrigin: Number(tokenIdOrigin)
            })
        }
        setDerivativeTokens(arrDerivativeTokens)
        return arrDerivativeTokens
    }

    async function getListedDerivatives() {
        const arrListedDerivatives = []
        const tokensOnSale = await contractTracker!.methods.getTokensOnSale(contractDerivative?.options.address).call()
        for (const tokenId of tokensOnSale){
            const {"0": price, "1": seller} = await contractTracker!.methods.getListing(contractDerivative!.options.address, tokenId).call()
            if (web3!.utils.toChecksumAddress(seller) !== web3!.utils.toChecksumAddress(account!)) continue
            const {tokenIdOrigin, derivative} = await contractDerivative!.methods.products(tokenId).call()
            const events = await getEventsFromDerivative(Number(tokenId))
            arrListedDerivatives.push({
                tokenId: Number(tokenId),
                type: Number(derivative),
                processDate: events[0].timestamp,
                tokenIdOrigin: Number(tokenIdOrigin),
                price: BigInt(price)
            })
        }
        setListedDerivatives(arrListedDerivatives)
        return arrListedDerivatives
    }

    async function refreshData() {
        setIsLoading(true)
        try {
            await Promise.all([
                getDonationTokens(),
                getDerivativeTokens(),
                getListedDerivatives()
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (web3) {
            refreshData()
        }
    }, [web3])

    // Calcular stats para gráficos
    const derivativeDistribution = [
        { name: 'Plasma', value: derivativeTokens.filter(d => d.type === 1).length, color: '#FF6B6B' },
        { name: 'Erythrocytes', value: derivativeTokens.filter(d => d.type === 2).length, color: '#4ECDC4' },
        { name: 'Platelets', value: derivativeTokens.filter(d => d.type === 3).length, color: '#FFE66D' }
    ].filter(item => item.value > 0)

    // Datos para gráfico de línea (simulado - últimos 7 días)
    const processingHistory = [
        { day: 'Mon', processed: 3 },
        { day: 'Tue', processed: 5 },
        { day: 'Wed', processed: 2 },
        { day: 'Thu', processed: 7 },
        { day: 'Fri', processed: 4 },
        { day: 'Sat', processed: 6 },
        { day: 'Sun', processed: donationTokens.length }
    ]

    return (
        <div className="flex flex-col flex-1 w-full h-full p-6 gap-6 bg-gray-50">
            {/* Header con título y stats */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Laboratory Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Address: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{truncateAddress(account || '')}</span>
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
                        <Stat
                            icon={<BeakerIcon className="h-6 w-6" />}
                            label="Blood Units"
                            value={donationTokens.length}
                            color="blood"
                        />
                        <Stat
                            icon={<CubeIcon className="h-6 w-6" />}
                            label="Derivatives"
                            value={derivativeTokens.length}
                            color="medical"
                        />
                        <Stat
                            icon={<ShoppingBagIcon className="h-6 w-6" />}
                            label="Items on Sale"
                            value={listedDerivatives.length}
                            color="blockchain"
                        />
                    </Grid>
                </motion.div>
            </div>

            {/* Gráficos */}
            {!isLoading && derivativeTokens.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PieChart - Distribución de derivados */}
                    <motion.div
                        className="bg-white rounded-xl shadow-card p-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Derivative Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={derivativeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {derivativeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* LineChart - Histórico de procesamiento */}
                    <motion.div
                        className="bg-white rounded-xl shadow-card p-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing History (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={processingHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="processed" stroke="#503291" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            )}

            {/* Secciones de inventario */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Stock of blood units */}
                <section className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Stock of Blood Units</h2>
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <>
                                <Skeleton variant="card" />
                                <Skeleton variant="card" />
                            </>
                        ) : donationTokens.length > 0 ? (
                            donationTokens.map((value) => (
                                <BloodCard
                                    key={value.tokenId}
                                    tokenId={value.tokenId}
                                    donationCenterAddress={value.donationCenterAddress}
                                    donationCenterName={value.donationCenterName}
                                    donationCenterLocation={value.donationCenterLocation}
                                    donationDate={value.extractionDatetime}
                                    onProcessSuccess={refreshData}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-6xl mb-4">🩸</div>
                                <p className="font-medium">No blood units in stock</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Stock of derivatives */}
                <section className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Stock of Derivatives</h2>
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <>
                                <Skeleton variant="card" />
                                <Skeleton variant="card" />
                            </>
                        ) : derivativeTokens.length > 0 ? (
                            derivativeTokens.map((value) => (
                                <DerivateCard
                                    key={value.tokenId}
                                    tokenId={value.tokenId}
                                    product={value.type}
                                    timestamp={value.processDate}
                                    tokenIdOrigin={value.tokenIdOrigin}
                                    onListSuccess={refreshData}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-6xl mb-4">🧪</div>
                                <p className="font-medium">No derivatives in stock</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Derivatives for sale */}
                <section className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Derivatives for Sale</h2>
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <>
                                <Skeleton variant="card" />
                                <Skeleton variant="card" />
                            </>
                        ) : listedDerivatives.length > 0 ? (
                            listedDerivatives.map((value) => (
                                <DerivateCard
                                    key={value.tokenId}
                                    tokenId={value.tokenId}
                                    product={value.type}
                                    timestamp={value.processDate}
                                    tokenIdOrigin={value.tokenIdOrigin}
                                    price={value.price}
                                    onCancelSuccess={refreshData}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-6xl mb-4">💰</div>
                                <p className="font-medium">No items listed for sale</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}