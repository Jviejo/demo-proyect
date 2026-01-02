import { RawMineralService } from "@/application/raw-mineral/RawMaterialService";
import { JewelOrder } from "@/domain/raw-mineral/RawMineral";
import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";

let rawMineralService: RawMineralService;
export const useRawMineralOrders = (provider: BrowserProvider | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<JewelOrder[]>([]);

  useEffect(() => {
    if (provider) {
      rawMineralService = new RawMineralService(provider);
    }
  }, [provider]);

  const orderMineral = useCallback(
    async (address: string, uniqueId: string, quantity: number) => {
      if (!rawMineralService) return;
      try {
        setIsLoading(true);
        const txHash = await rawMineralService.orderMaterial(address, uniqueId, quantity); // TODO: Cambiar de forma dinámica
        return txHash;
      } catch (err) {
        console.error("Error to order mineral:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getOrderPending = useCallback(async () => {
    if (!rawMineralService) return;

    try {
      const orderJewels: JewelOrder[] =
        await rawMineralService.getOrderPending();
      setOrders(orderJewels);
    } catch (err) {
      console.error("Error to get pending orders:", err);
    }
  }, []);

  const sendMaterial = useCallback(
    async (uniqueId: string, indexOrder: number) => {
      if (!rawMineralService) return;

      try {
        setIsLoading(true);
        await rawMineralService.sendMaterial(uniqueId, indexOrder);
      } catch (err) {
        console.error("Error to send material:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getOrderPending();
  }, [getOrderPending]);

  return {
    orders,
    isLoading,
    orderMineral,
    getOrderPending,
    sendMaterial,
  };
};
