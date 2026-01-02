"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJewelFactoryService } from "@/hooks/jewel-factory/useJewelFactoryService";
import { Jewel } from "@/infraestructure/IJewelFactory";
import { formatDate } from "@/utils/dateUtils";
import { TruncateItem } from "@/components/truncate/TruncateItem";

export default function JewelDetails({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { jewels, isLoading, error, getAllJewels } = useJewelFactoryService();
    const [jewel, setJewel] = useState<Jewel | null>(null);

    useEffect(() => {
        const fetchJewel = async () => {
            await getAllJewels();
        };
        fetchJewel();
    }, [getAllJewels]);

    useEffect(() => {
        if (jewels.length > 0) {
            const foundJewel = jewels.find(j => j.tokenId === parseInt(params.id));
            setJewel(foundJewel || null);
        }
    }, [jewels, params.id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <p>{error}</p>
            </div>
        );
    }

    if (!jewel) {
        return (
            <div className="alert alert-error">
                <p>Joya no encontrada</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Detalles de la Joya #{jewel.tokenId}</h1>
                <button 
                    onClick={() => router.back()} 
                    className="btn btn-outline"
                >
                    Volver
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información General */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Información General</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="font-bold">Nombre:</span> {jewel.name}
                            </p>
                            <p>
                                <span className="font-bold">Fecha de Creación:</span>{" "}
                                {formatDate(new Date(jewel.creationDate * 1000))}
                            </p>
                            <p>
                                <span className="font-bold">Creador:</span>{" "}
                                <TruncateItem item={jewel.creator} />
                            </p>
                            <p>
                                <span className="font-bold">Cantidad Total:</span>{" "}
                                {jewel.totalSupply}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Datos Técnicos */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Datos Técnicos</h2>
                        <div className="space-y-2">
                            {jewel.data && (
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-bold">Calidad:</span>{" "}
                                        {jewel.data.quality} quilates
                                    </p>
                                    <p>
                                        <span className="font-bold">Diseño:</span>{" "}
                                        {jewel.data.design}
                                    </p>
                                    <p>
                                        <span className="font-bold">Certificación:</span>{" "}
                                        {jewel.data.certification}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Materiales Utilizados */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Materiales Utilizados</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Material ID</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jewel.materials.map((material, index) => (
                                    <tr key={index}>
                                        <td>
                                            <TruncateItem item={material.materialId} />
                                        </td>
                                        <td>{material.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Historial de Propiedad */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Historial de Propiedad</h2>
                    <div className="space-y-2">
                        {jewel.ownershipHistory.map((owner, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">#{index + 1}</span>
                                <TruncateItem item={owner} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 