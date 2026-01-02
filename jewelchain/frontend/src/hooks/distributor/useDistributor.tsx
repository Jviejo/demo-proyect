import { DistributorService } from "@/application/distributor/DistributorService";
import { useAuth } from "@/context/AuthContext";
import { Shipment } from "@/domain/distributor/Distributor";
import { useCallback, useEffect, useState } from "react";

let distributorService: DistributorService;
export const useDistributor = () => {
  const { provider } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (provider) {
      distributorService = new DistributorService(provider);
    }
  }, [provider]);

  const listShipmentsPending = useCallback(async () => {
    if (!distributorService) return;
    try {
      const ships = await distributorService.getShipments();
      setShipments(ships);
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  const confirmDelivery = useCallback(async (trackingId: string) => {
    if (!distributorService) return;
    setIsLoading(true);
    try {
      await distributorService.confirmDelivery(trackingId);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    shipments,
    listShipmentsPending,
    confirmDelivery,
  };
};
