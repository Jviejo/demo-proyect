"use client";

import { useJewelFactoryService } from "@/hooks/jewel-factory/useJewelFactoryService";
import { InventoryTable } from "@/components/JewelFactory/InventoryTable";
import { FaSync } from "react-icons/fa";
import { useEffect } from "react";

export default function JewelFactoryInventory() {
  const { inventory, isLoading, error, getAllMaterialsInventory } = useJewelFactoryService();

  useEffect(() => {
    getAllMaterialsInventory();
  }, [getAllMaterialsInventory]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventario de Fábrica</h1>
        <button 
          onClick={getAllMaterialsInventory} 
          className="btn btn-outline"
          disabled={isLoading}
        >
          <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
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
        <InventoryTable inventory={inventory} />
      )}
    </div>
  );
} 