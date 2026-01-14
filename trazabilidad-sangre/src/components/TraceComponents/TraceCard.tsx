'use client';

import { Derivative, EventTrace } from "@/lib/types";
import { formatDateTime, truncateAddress, getDerivativeTypeName, getEventTypeName } from "@/lib/helpers";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { useEffect, useState } from "react";
import { getCompanyName } from "@/lib/helpers";

interface TraceCardProps {
    tokenId: number;
    product: Derivative;
    trace: EventTrace;
    index?: number;
}

// Mapeo de iconos por tipo de evento
const eventIcons: Record<string, string> = {
    'Donation': '🩸',
    'Transfer': '🔄',
    'Processing': '⚗️',
    'Sale': '💰',
    'Purchase': '🛒',
    'Listed': '📋',
    'Unlisted': '❌',
    'Completed': '✅'
};

// Mapeo de colores de borde por tipo de evento
const eventBorderColors: Record<string, string> = {
    'Donation': 'border-l-red-500',
    'Transfer': 'border-l-blue-500',
    'Processing': 'border-l-purple-500',
    'Sale': 'border-l-green-500',
    'Purchase': 'border-l-yellow-500',
    'Listed': 'border-l-indigo-500',
    'Unlisted': 'border-l-gray-500',
    'Completed': 'border-l-green-600'
};

export function TraceCard({ product, tokenId, trace, index = 0 }: TraceCardProps) {
    const [companyName, setCompanyName] = useState<string>('Cargando...');

    // Obtener icono del evento (default 📌)
    const eventIcon = eventIcons[trace.event] || '📌';

    // Obtener color del borde (default violeta)
    const borderColor = eventBorderColors[trace.event] || 'border-l-primary-500';

    // Nombre del evento en español
    const eventDisplayName = getEventTypeName(trace.event);

    // Nombre del tipo de derivado
    const productTypeName = getDerivativeTypeName(Number(product));

    // Resolver nombre de compañía
    useEffect(() => {
        const fetchCompanyName = async () => {
            const name = await getCompanyName(trace.owner);
            setCompanyName(name);
        };

        fetchCompanyName();
    }, [trace.owner]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: 'easeOut'
            }}
            className={`
                relative
                block max-w-lg p-6
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                ${borderColor} border-l-4
                rounded-lg shadow-md
                hover:shadow-lg hover:scale-[1.02]
                transition-all duration-200
                m-3
            `}
        >
            {/* Header con icono y fecha */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl" role="img" aria-label={trace.event}>
                        {eventIcon}
                    </span>
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                        {eventDisplayName}
                    </h5>
                </div>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(trace.timestamp)}
                </time>
            </div>

            {/* Información del producto */}
            <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{productTypeName}</span>: #{String(tokenId)}
                </p>

                {/* Owner con tooltip */}
                <div className="flex items-center gap-1">
                    <span className="text-gray-600 dark:text-gray-400">Propietario:</span>
                    <Tooltip content={trace.owner} position="top">
                        <span className="font-mono text-primary-600 dark:text-primary-400 cursor-help">
                            {truncateAddress(trace.owner)}
                        </span>
                    </Tooltip>
                </div>

                {/* Compañía con nombre resuelto */}
                <p className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">Compañía:</span>{' '}
                    <span className="font-medium">{companyName}</span>
                </p>

                {/* Ubicación con icono */}
                <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <span role="img" aria-label="location">📍</span>
                    <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>{' '}
                    <span>{trace.location}</span>
                </p>

                {/* Block number discreto */}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    Bloque: {trace.blockNumber}
                </p>
            </div>
        </motion.div>
    );
}
