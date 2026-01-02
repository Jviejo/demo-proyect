import { RawMineralService } from "@/application/raw-mineral/RawMaterialService";
import {
  RawMineralChain,
  RawMineralForm,
} from "@/domain/raw-mineral/RawMineral";
import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";

let rawMineralService: RawMineralService;
export const useRawMineralService = (provider: BrowserProvider | null) => {
  const [rawMineralList, setRawMineralList] = useState<RawMineralChain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (provider) {
      rawMineralService = new RawMineralService(provider);
    }
  }, [provider]);

  const getAllRawMineral = useCallback(async (address: string) => {
    if (!address || !rawMineralService) return;

    try {
      setIsLoading(true);
      const rawMinerals = await rawMineralService.getJewelRecordBySupplier(
        address
      );
      setRawMineralList(rawMinerals);
    } catch (err) {
      console.error("Error fetching raw minerals:", err);
      setError("Failed to fetch raw minerals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRawMineral = useCallback(async (mineralData: RawMineralForm) => {
    if (!rawMineralService) return;

    try {
      setIsLoading(true);
      const txHash = await rawMineralService.createRawMineral(mineralData);
      return txHash;
    } catch (err) {
      console.error("Error creating raw mineral:", err);
      setError("Failed to create raw mineral");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    rawMineralList,
    isLoading,
    error,
    getAllRawMineral,
    createRawMineral,
  };
};
