"use client";

import { PurchaseOrder } from "@/types/purchaseOrder";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye, FaEdit } from "react-icons/fa";

export function PurchaseOrderTable() {
  // TODO: Reemplazar con datos reales de tu API/Smart Contract
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-001",
      creationDate: new Date("2024-02-20"),
      supplier: "Proveedor A",
      materials: "Oro, Plata, Diamantes",
      totalQuantity: 100,
      status: "Pendiente",
      estimatedDeliveryDate: new Date("2024-03-20"),
    },
    // Más órdenes...
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Fecha Creación</th>
            <th>Proveedor</th>
            <th>Materiales</th>
            <th>Cantidad Total</th>
            <th>Estado</th>
            <th>Fecha Recepción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{formatDate(order.creationDate)}</td>
              <td>{order.supplier}</td>
              <td>{order.materials}</td>
              <td>{order.totalQuantity}</td>
              <td>
                <span className={`badge ${getStatusBadgeColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>{formatDate(order.estimatedDeliveryDate)}</td>
              <td className="space-x-2">
                <Link
                  href={`/dashboard/purchase-orders/${order.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/purchase-orders/${order.id}/edit`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEdit className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pendiente":
      return "badge-warning";
    case "aprobada":
      return "badge-success";
    case "recibida":
      return "badge-info";
    default:
      return "badge-ghost";
  }
} 