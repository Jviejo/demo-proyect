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
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-row items-center gap-4 hover:border-blood-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Icon and ID */}
                <div className="flex items-center gap-2 min-w-[120px]">
                    <DonationIcon />
                    <h2 className="text-base font-bold text-slate-900">#{tokenId}</h2>
                </div>

                {/* Info compacta */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="font-semibold">{formatDate(donationDate)}</span>
                        <span className="text-slate-400">•</span>
                        <span className="truncate">{donationCenterName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">📍 {donationCenterLocation}</span>
                    </div>
                    <Tooltip content={donationCenterAddress}>
                        <span className="text-xs font-mono text-slate-500">{truncateAddress(donationCenterAddress)}</span>
                    </Tooltip>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                        href={`/trace/${tokenId}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blood-600 hover:text-blood-700 hover:underline transition-colors"
                    >
                        View trace
                        <svg className="w-3 h-3 ms-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                        </svg>
                    </Link>

                    <motion.button
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blood-600 rounded-md hover:bg-blood-700 focus:ring-2 focus:outline-none focus:ring-blood-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setShowModal(true)}
                        disabled={isProcessing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                Process
                                <svg className="rtl:rotate-180 w-3 h-3 ms-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg>
                            </>
                        )}
                    </motion.button>
                </div>
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
