"use client";

import { JewelOrder } from "@/domain/raw-mineral/RawMineral";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { TruncateItem } from "../truncate/TruncateItem";

interface SalesOrderTableProps {
  orders: JewelOrder[];
}

export function SalesOrderTable({ orders }: SalesOrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Fecha Creación</th>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Cantidad Total</th>
            <th>Método de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.uniqueId}>
              <td>
                <TruncateItem item={order.uniqueId} />
              </td>
              <td>{formatDate(new Date(Number(order.date)))}</td>
              <td>
                <TruncateItem item={order.to} />
              </td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>USDT</td>
              <td className="space-x-2">
                <Link
                  href={{
                    pathname: `/dashboard/sales-orders/${order.uniqueId}`,
                    query: { order: JSON.stringify(order) },
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
