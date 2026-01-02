import { useAuthorization } from "./useAuthorization";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const canAccessRawMaterial = useAuthorization([
    "ADMIN_ROLE", 
    "RAW_MINERAL_ROLE"
  ]);
  
  const canAccessPurchaseOrders = useAuthorization([
    "ADMIN_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);
  
  const canAccessSalesOrders = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);
  
  const canAccessTransactions = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);
  
  const canAccessLocations = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (user) {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    checkPermissions();
  }, [user]);

  return {
    isLoading,
    canAccessRawMaterial,
    canAccessPurchaseOrders,
    canAccessSalesOrders,
    canAccessTransactions,
    canAccessLocations
  };
}; 