"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { SalesOrderTable } from "@/components/SalesOrder/SalesOrderTable";
import { useAuth } from "@/context/AuthContext";
import { useRawMineralOrders } from "@/hooks/raw-mineral/useRawMineralOrders";
import { useEffect, useState } from "react";

export default function SalesOrders() {
  const { provider } = useAuth();
  const { orders, getOrderPending } = useRawMineralOrders(provider);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getOrders = async () => {
      await getOrderPending();
      setIsLoading(false);
    };
    setIsLoading(true);
    getOrders();
  }, [getOrderPending]);

  const isAuthorized = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE",
  ]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Órdenes de Venta</h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <SalesOrderTable orders={orders} />
      )}
    </div>
  );
}
