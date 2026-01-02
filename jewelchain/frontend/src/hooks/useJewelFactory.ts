import { useAuth } from "@/context/AuthContext";
import { JewelFactorySC } from "@/infraestructure/JewelFactorySC";
import { MaterialInventory } from "@/infraestructure/IJewelFactory";
import { useState, useEffect, useCallback } from "react";

export const useJewelFactory = () => {
  const { provider } = useAuth();
  const [inventory, setInventory] = useState<MaterialInventory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInventory = useCallback(async () => {
    if (!provider) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const jewelFactory = new JewelFactorySC(provider);
      console.log("jewelFactory!!!", jewelFactory);
      const inventoryData = await jewelFactory.getAllMaterialsInventory();
      console.log("inventoryData!!!", inventoryData);
      setInventory(inventoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (provider) {
      getInventory();
    }
  }, [provider, getInventory]);

  return {
    inventory,
    isLoading,
    error,
    refreshInventory: getInventory
  };
}; 