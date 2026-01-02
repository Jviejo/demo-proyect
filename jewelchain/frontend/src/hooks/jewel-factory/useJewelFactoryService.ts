import { useState, useCallback } from "react";
import { JewelFactoryService } from "@/application/jewel-factory/JewelFactoryService";
import { MaterialInventory, Jewel, CreateJewelDTO } from "@/infraestructure/IJewelFactory";
import { useAuth } from "@/context/AuthContext";

export const useJewelFactoryService = () => {
    const { provider } = useAuth();
  // Estados existentes para el inventario de materiales
  const [inventory, setInventory] = useState<MaterialInventory[]>([]);
  
  // Nuevos estados para la gestión de joyas
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Función existente para obtener el inventario de materiales
  const getAllMaterialsInventory = useCallback(async () => {
    if (!provider) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
        const service = new JewelFactoryService(provider);

      const inventoryData = await service.getAllMaterialsInventory();
      setInventory(inventoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  // Nuevas funciones para la gestión de joyas
  const getAllJewels = useCallback(async () => {
    if (!provider) return;

    try {
      const service = new JewelFactoryService(provider);
      setIsLoading(true);
      setError(null);
      const result = await service.getAllJewels();
      setJewels(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const createJewel = async (jewel: CreateJewelDTO) => {
    if (!provider) return;

    try {
      const service = new JewelFactoryService(provider);
      setIsLoading(true);
      setError(null);
      await service.createJewel(jewel);
      await getAllJewels(); // Actualizar la lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la joya');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Retornos existentes para el inventario de materiales
    inventory,
    getAllMaterialsInventory,
    
    // Nuevos retornos para la gestión de joyas
    jewels,
    isLoading,
    error,
    getAllJewels,
    createJewel
  };
}; 