import { Derivative } from "@/lib/types"
import Link from "next/link"
import { ErythrocytesIcon, PlasmaIcon, PlateletsIcon } from "../ProductIcons"
import Web3 from "web3"
import { useWallet } from "../ConnectWalletButton"
import { useState } from "react"
import { ConfirmModal } from "../ui/ConfirmModal"
import { showTransactionSuccess, showTransactionError, showTransactionPending } from "@/lib/toast"
import { motion } from "framer-motion"
import { formatDate, formatEther, getDerivativeTypeName } from "@/lib/helpers"
import { Tooltip } from "../ui/Tooltip"

interface DerivateCardProps {
    tokenId: number
    product: Derivative
    timestamp: Date
    tokenIdOrigin: number
    price?: bigint
    onListSuccess?: () => void
    onCancelSuccess?: () => void
}

const productText = [undefined, 'Plasma', 'Erythrocytes', 'Platelets', 'Blood']

export function DerivateCard ({tokenId, product, timestamp, tokenIdOrigin, price, onListSuccess, onCancelSuccess}: DerivateCardProps) {
    const {account, contractTracker, contractDerivative} = useWallet()
    const [listingPrice, setListingPrice] = useState('')
    const [isInvalidPrice, setIsInvalidPrice] = useState(false)
    const [showListModal, setShowListModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [isListing, setIsListing] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    function handleListClick() {
        if (!listingPrice || Number(listingPrice) <= 0) {
            setIsInvalidPrice(true)
            return
        }
        setShowListModal(true)
    }

    async function listItem() {
        setShowListModal(false)
        setIsListing(true)
        showTransactionPending()

        try {
            await contractDerivative!.methods
                .approve(contractTracker!.options.address, tokenId)
                .send({from: account!})

            const receipt = await contractTracker!.methods
                .listItem(contractDerivative!.options.address, tokenId, Web3.utils.toWei(listingPrice, 'ether'))
                .send({from: account!})

            showTransactionSuccess(receipt.transactionHash)

            if (onListSuccess) {
                onListSuccess()
            }
        } catch (error: any) {
            showTransactionError(error)
        } finally {
            setIsListing(false)
        }
    }

    async function cancelListing() {
        setShowCancelModal(false)
        setIsCancelling(true)
        showTransactionPending()

        try {
            const receipt = await contractTracker!.methods
                .cancelListing(contractDerivative!.options.address, tokenId)
                .send({from: account!})

            showTransactionSuccess(receipt.transactionHash)

            if (onCancelSuccess) {
                onCancelSuccess()
            }
        } catch (error: any) {
            showTransactionError(error)
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <>
            <motion.div
                className="max-w-lg p-6 bg-white border-2 border-slate-200 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-start gap-5 hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-row items-center gap-3">
                    {product === Derivative.Plasma && <PlasmaIcon/>}
                    {product === Derivative.Erythrocytes && <ErythrocytesIcon/>}
                    {product === Derivative.Platelets && <PlateletsIcon/>}
                    <h2 className="text-xl font-bold text-slate-900">{productText[product]} #{tokenId}</h2>
                </div>

                <h3 className="font-normal text-slate-700">
                    <span className="font-semibold">Processing date:</span> {formatDate(timestamp)}
                </h3>

                <Link href={`/trace/${tokenIdOrigin}`} className="inline-flex font-medium items-center text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                    View traceability from donation #{tokenIdOrigin}
                    <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                    </svg>
                </Link>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                    {price ? (
                        <>
                            <span className="text-lg font-bold text-success-600">
                                Price: {formatEther(price, 4)} ETH
                            </span>
                            <motion.button
                                onClick={() => setShowCancelModal(true)}
                                disabled={isCancelling}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isCancelling ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        Remove Listing
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 flex-1">
                                <input
                                    className={`px-3 py-2 text-center bg-gray-50 border ${isInvalidPrice ? 'border-red-500' : 'border-gray-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full`}
                                    type="number"
                                    placeholder="Price in ETH"
                                    required
                                    value={listingPrice}
                                    onChange={(e) => {
                                        setIsInvalidPrice(false)
                                        setListingPrice(e.target.value)
                                    }}
                                    min={0}
                                    step="0.001"
                                />
                                {isInvalidPrice && (
                                    <span className="text-xs text-red-600">Please enter a valid price</span>
                                )}
                            </div>
                            <motion.button
                                onClick={handleListClick}
                                disabled={isListing}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-success-600 rounded-lg hover:bg-success-700 focus:ring-4 focus:outline-none focus:ring-success-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isListing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Listing...
                                    </>
                                ) : (
                                    <>
                                        List for Sale
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Modal para confirmar listado */}
            <ConfirmModal
                isOpen={showListModal}
                onClose={() => setShowListModal(false)}
                onConfirm={listItem}
                title="List Derivative for Sale"
                message={`Are you sure you want to list ${getDerivativeTypeName(product)} #${tokenId} for ${listingPrice} ETH?`}
                confirmText="List"
                cancelText="Cancel"
            />

            {/* Modal para confirmar cancelación */}
            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={cancelListing}
                title="Cancel Listing"
                message={`Are you sure you want to remove ${getDerivativeTypeName(product)} #${tokenId} from the marketplace?`}
                confirmText="Remove"
                cancelText="Cancel"
            />
        </>
    )
}



