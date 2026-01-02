"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { TransactionTable } from "@/components/Transaction/TransactionTable";

export default function Transactions() {
  const isAuthorized = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transacciones</h1>
      </div>
      <TransactionTable />
    </div>
  );
} 