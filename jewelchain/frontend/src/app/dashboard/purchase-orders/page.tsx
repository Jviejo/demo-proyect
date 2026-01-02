"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { PurchaseOrderTable } from "@/components/PurchaseOrder/PurchaseOrderTable";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function PurchaseOrders() {
  const isAuthorized = useAuthorization([
    "ADMIN_ROLE",
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
        <h1 className="text-2xl font-bold">Órdenes de Compra</h1>
        <Link 
          href="/dashboard/purchase-orders/new" 
          className="btn btn-primary"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Crear Nueva Orden
        </Link>
      </div>
      <PurchaseOrderTable />
    </div>
  );
} 