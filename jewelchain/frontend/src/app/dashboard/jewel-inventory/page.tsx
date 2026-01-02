"use client";

import { useJewelFactoryService } from "@/hooks/jewel-factory/useJewelFactoryService";
import { JewelTable } from "@/components/JewelFactory/JewelTable";
import { CreateJewelModal } from "@/components/JewelFactory/CreateJewelModal";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function JewelInventory() {
    const { jewels, isLoading, error, getAllJewels, createJewel } = useJewelFactoryService();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchJewels = async () => {
            await getAllJewels();
        };
        fetchJewels();
    }, [getAllJewels]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Inventario de Joyas</h1>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="btn btn-primary"
                >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Fabricar Joya
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <JewelTable jewels={jewels} />
            )}

            <CreateJewelModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createJewel}
            />
        </div>
    );
} 