'use client'

import { useState } from "react";
import { Address } from "@/lib/types";
import Link from "next/link";
import { DonationIcon } from "../ProductIcons";
import { useWallet } from "../ConnectWalletButton";
import { ConfirmModal } from "../ui/ConfirmModal";
import { showTransactionSuccess, showTransactionError, showTransactionPending } from "@/lib/toast";
import { motion } from "framer-motion";
import { formatDate, truncateAddress } from "@/lib/helpers";
import { Tooltip } from "../ui/Tooltip";

interface BloodCardProps {
    tokenId: number
    donationCenterAddress: Address
    donationCenterName: string
    donationCenterLocation: string
    donationDate: Date
    onProcessSuccess?: () => void
}

export function BloodCard ({tokenId, donationCenterAddress, donationCenterName, donationCenterLocation, donationDate, onProcessSuccess}: BloodCardProps) {
    const { account, contractTracker } = useWallet()
    const [showModal, setShowModal] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    async function processBloodUnit() {
        if (!account) return

        setShowModal(false)
        setIsProcessing(true)
        showTransactionPending()

        try {
            const receipt = await contractTracker?.methods.process(tokenId).send({
                from: account
            })
            showTransactionSuccess(receipt.transactionHash)

            // Callback para refrescar datos
            if (onProcessSuccess) {
                onProcessSuccess()
            }
        } catch (error: any) {
            showTransactionError(error)
        } finally {
            setIsProcessing(false)
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
                    <DonationIcon />
                    <h2 className="text-xl font-bold text-slate-900">Donation #{tokenId}</h2>
                </div>

                <h3 className="font-normal text-slate-700">
                    <span className="font-semibold">Extraction date:</span> {formatDate(donationDate)}
                </h3>

                <div className="font-normal text-start w-full">
                    <h3 className="text-slate-900 font-semibold mb-2">Donation Center: {donationCenterName}</h3>
                    <div className="font-normal flex flex-col items-start text-slate-600 space-y-1">
                        <p>📍 Location: {donationCenterLocation}</p>
                        <Tooltip content={donationCenterAddress}>
                            <p>Address: <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{truncateAddress(donationCenterAddress)}</span></p>
                        </Tooltip>
                    </div>
                </div>

                <Link href={`/trace/${tokenId}`} className="inline-flex font-medium items-center text-blood-600 hover:text-blood-700 hover:underline transition-colors">
                    View full traceability
                    <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                    </svg>
                </Link>

                <motion.button
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blood-600 rounded-lg hover:bg-blood-700 focus:ring-4 focus:outline-none focus:ring-blood-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setShowModal(true)}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            Process Blood Unit
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </>
                    )}
                </motion.button>
            </motion.div>

            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={processBloodUnit}
                title="Process Blood Unit"
                message={`Are you sure you want to process donation #${tokenId}? This will burn the blood NFT and create derivative tokens.`}
                confirmText="Process"
                cancelText="Cancel"
            />
        </>
    )
}
