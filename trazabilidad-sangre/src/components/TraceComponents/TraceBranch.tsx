'use client'

import { Derivative, ProductTrace } from "@/lib/types"
import { TraceCard } from "./TraceCard"
import { motion } from "framer-motion"

interface TraceBranchProps {
    trace: ProductTrace
    product: Derivative
}

export function TraceBranch({trace, product}: TraceBranchProps){
    const totalEvents = trace.trace.length

    return (
        <div className="relative flex flex-col">
            {/* Línea vertical conectora */}
            {totalEvents > 1 && (
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 via-success-500/50 to-primary-500/50">
                    {/* Animación de draw progresivo */}
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-500 via-success-500 to-primary-500"
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.3
                        }}
                    />
                </div>
            )}

            {/* Timeline events */}
            <div className="space-y-6">
                {trace.trace.map((value, key) => {
                    const isFirst = key === 0
                    const isLast = key === totalEvents - 1

                    return (
                        <div key={key} className="relative">
                            {/* Nodo circular de conexión */}
                            {totalEvents > 1 && (
                                <motion.div
                                    className="absolute left-6 top-8 -translate-x-1/2 z-10"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: 0.3 + (key * 0.15),
                                        duration: 0.3
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded-full border-3 ${
                                        isFirst
                                            ? 'bg-primary-500 border-primary-300'
                                            : isLast
                                            ? 'bg-success-500 border-success-300'
                                            : 'bg-white border-primary-400'
                                    } shadow-lg`}>
                                        {/* Pulso para el primer nodo */}
                                        {isFirst && (
                                            <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Card con padding para la línea */}
                            <div className={totalEvents > 1 ? "pl-16" : ""}>
                                <TraceCard
                                    product={product}
                                    tokenId={trace.tokenId}
                                    trace={value}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}